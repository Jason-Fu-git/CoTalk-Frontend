import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

import MessageCard from '@/components/MessageCard';
import { store } from "@/app/redux/store";
import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';

const [messages, setMessages]=useState([]);
const [count, setCount]=useState(0);

async function getChatMessages(chatid)
{
    const res= await request(`${BACKEND_URL}/api/chat/${chatid}/messages`, "GET", true)
    if (Number(res.code)===0)
    {
        const history=res.messages;
        let new_list=[];

        for (let item of history) 
        {
            setCount(count + 1);

            // Sender avatar
            let sender_avatar = "";
            const url = await request(`${BACKEND_URL}/api/user/private/${item.sender_id}/avatar`, "GET", false);
            sender_avatar = url;
            const datetime = new Date(item.create_time).toLocaleString('en', dateOptions);

            // Mark as read
            if (!item.read_users.includes(self_id)) 
            {
                await request(`${BACKEND_URL}/api/message/${item.msg_id}/management`, "PUT", true, 
                {
                    "user_id": self_id,
                });
            }

            new_list.push({
                'index': count, 
                'sender_name': "后端目前没有返回用户名",
                'sender_id': item.sender_id,
                'sender_avatar': sender_avatar,
                
                'message': item.msg_text,
                'message_id': item.msg_id,

                'datetime': datetime,
            });

            setCount(count+1);
        }
        setMessages(new_list);
    }
}

function Conversation()
{
    const router = useRouter();
    const {chatid} = router.query;
    const self_id=store.getState().auth.id;

    // 第一次渲染时将所有已有消息标记为已读
    const [firstRender, setFirstRender]=useState(true);
    // 用这个值来手动刷新
    const [toggle, setToggle]=useState(true);

    useEffect(()=> {
        console.log("useEffect执行刷新");
        console.log("当前消息列表: "+messages);

        if (firstRender)
        {
            getChatMessages(chatid);
            setFirstRender(false);
        }

        // 连接WebSocket
        const url=`wss://cotalkbackend-Concord.app.secoder.net/ws/chat/${chatid}/`;
        const chatSocket=new WebSocket(url);
    
        const generalUrl="ws://cotalkbackend-Concord.app.secoder.net/ws/main/"+
        store.getState().auth.id+"/"+store.getState().auth.token;
        const generalSocket=new WebSocket(generalUrl);

        return () => {
            chatSocket.close();
            generalSocket.close();
        }
    }, [toggle]);

    //客户端收到消息时触发
    chatSocket.onmessage=function(event) {
        const data=JSON.parse(event.data);
        
        //将新消息添加到后面
        const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
        const datetime=new Date(data.datetime).toLocaleString('en', dateOptions);
        const sender_name=data.sender_name;
        const sender_id=data.sender_id;
        let sender_avatar="";
        
        request(`${BACKEND_URL}/api/user/private/${sender_id}/avatar`, "GET", false)
		.then((url) => {
			sender_avatar=url;
		});
        
        const oldMessages=messages;
        const newMessages=oldMessages.concat([{
            'index': count,
            'sender_name': sender_name,
            'sender_id': sender_id,
            'sender_avatar': sender_avatar,

            'message': data.message,
            'message_id': data.msg_id,

            'datetime': datetime,
        }]);
            
        setCount(count+1);
        setMessages(newMessages);
        setToggle(!toggle);
    };

    chatSocket.onclose=function(event) {
        console.log('Chat socket closed');
    };

    chatSocket.onopen=function(event) {
        console.log("Open websocket");
    };

    const sendMessage=function(event) {
        let inputArea=document.getElementById('chat-message-input');
        const message=inputArea.value;
        if (message)
        {
            // 通过WebSocket发送一份
            chatSocket.send(JSON.stringify({
                'message': message,
                'sender_id': store.getState().auth.id,
                'sender_name': store.getState().auth.name,
            }));

            // 通过Http发送一份
            request(`${BACKEND_URL}/api/message/send`, "POST", true, "application/json", 
            {
                "user_id": store.getState().auth.id,
                "chat_id": chatid,
                "msg_text": message,
                "msg_type": "text",
            })
            .then((res) => {
                if (Number(res.code)!==0) {
                    alert("发送失败");
                }
            });

            inputArea.value='';
            inputArea.focus();
        }
        else
        {
            inputArea.value='';
            inputArea.focus();
        }
    }

    generalSocket.onmessage=function(event) {
        console.log('General websocket receive something');
    }

    generalSocket.onclose=function(event) {
        console.log('General socket closed');
    };

    generalSocket.onopen=function(event) {
        console.log("Open general websocket");
    };

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                聊天室
                </h1>
                <Link href={`/chat/${chatid}`} passHref>
                    <button className="btn btn-secondary">
                    群聊信息
                    </button>
                </Link>
                <Link href={`/chat/${chatid}/search`} passHref>
                    <button className="btn btn-secondary">
                    搜索聊天记录
                    </button>
                </Link>

                <div>
                {messages.map((message) => (
                        <div key={message.index}>
                            <MessageCard {...message}/>
                        </div>
                ))}
                </div>

                <div className="input-group mb-3">
                    <input
                        className="form-control col_auto"
                        type="text"
                        placeholder="请输入聊天内容"
                        id="chat-message-input"
                    />
                    <div className="col-auto">
                        <button 
                            name="submit"
                            className="btn btn-primary"
                            onClick={sendMessage}
                        >
                        发送
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Conversation;
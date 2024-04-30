import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

import MessageCard from '@/components/MessageCard';
import { store } from "@/app/redux/store";
import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';

function Conversation()
{
    const router = useRouter();
    const {chatid} = router.query;

    const url=`wss://cotalkbackend-Concord.app.secoder.net/ws/chat/${chatid}/`;
    const chatSocket=new WebSocket(url);

    const [messages, setMessages]=useState([]);
    const [count, setCount]=useState(0);
    // 第一次渲染时将所有已有消息标记为已读
    const [firstRender, setFirstRender]=useState(true);
    // 用这个值来手动刷新
    const [toggle, setToggle]=useState(true);

    useEffect(()=> {
        if (firstRender)
        {
            const url=`${BACKEND_URL}/api/chat/${chatid}/messages?user_id=`+store.getState().auth.id;
        
            request(url, "GET", true)
            .then(async (res) => {
                const promises = res.messages.map(async function (element, index){
                    // modify every notification
                    // set the sender's name
                    const sender_id=element.sender_id;
        
                    let sender_name="??";
                    await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                    .then((res) => {
                        sender_name=res.user_name;
                    });
        
                    const sender_avatar = await request(`${BACKEND_URL}/api/user/private/${element.sender_id}/avatar`, "GET", false);
                    const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
                    const datetime = new Date(element.create_time).toLocaleString('en', dateOptions);
        
                    // Mark as read
                    if (!element.read_users.includes(store.getState().auth.id)) 
                    {
                        await request(`${BACKEND_URL}/api/message/${item.msg_id}/management`,
                        "PUT", true, "application/json",
                        {
                            "user_id": store.getState().auth.id,
                        });
                    }
        
                    return ({
                        'index': index,
                        'sender_name': sender_name,
                        'sender_id': sender_id,
                        'sender_avatar': sender_avatar,
            
                        'message': element.msg_text,
                        'message_id': element.msg_id,
        
                        'datetime': datetime,
                    });
                });
                const messages = await Promise.all(promises);
                setMessages(messages);
            });
            //setCount(history.length);
            setFirstRender(false);
        }

        // 连接WebSocket   
        const generalUrl="ws://cotalkbackend-Concord.app.secoder.net/ws/main/"+
        store.getState().auth.id+"/"+store.getState().auth.token;
        const generalSocket=new WebSocket(generalUrl);

        generalSocket.onmessage=function(event) {
            //console.log('General websocket receive something');
        }
    
        generalSocket.onclose=function(event) {
            //console.log('General socket closed');
        };
    
        generalSocket.onopen=function(event) {
            //console.log("Open general websocket");
        };

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
        //console.log('Chat socket closed');
    };

    chatSocket.onopen=function(event) {
        //console.log("Open websocket");
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

    const deleteMessage=function(event) {
        console.log("delete function called.");
		console.log("message id: "+props.message_id);
		request(`${BACKEND_URL}/api/message/${props.message_id}/management`,
				"DELETE", true, "application/json", 
			{
				"user_id": props.sender_id,
				"is_remove": false,
			})
		.then((res) => {
			if (Number(res.code)===0) {
				alert("成功删除");
			}
		});
    }

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
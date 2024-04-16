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

    useEffect(()=> {
        console.log("useEffect执行刷新");
        console.log("当前消息列表: "+messages);

        return () => {
            chatSocket.close();
        }
    }, [messages]);

    //客户端收到消息时触发
    chatSocket.onmessage=function(event) {
        const data=JSON.parse(event.data);
        
        //将新消息添加到后面
        const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
        const datetime=new Date(data.datetime).toLocaleString('en', dateOptions);
        const sender_name=data.sender_name;
        const sender_id=data.sender_id;
        let sender_avatar="";
        console.log(sender_id);
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
            'datetime': datetime,
        }]);
            
        setCount(count+1);
        setMessages(newMessages);
    };

    chatSocket.onclose=function(event) {
        console.error('Websocket连接已断开');
    };

    chatSocket.onopen=function(event) {
        console.log("Websocket连接已建立");
    };

    const sendMessage=function(event) {
        let inputArea=document.getElementById('chat-message-input');
        const message=inputArea.value;
        if (message)
        {
            console.log("前端发送: "+message);
            chatSocket.send(JSON.stringify({
                'message': message,
                'sender_id': store.getState().auth.id,
                'sender_name': store.getState().auth.name,
            }));
    
            inputArea.value='';
            inputArea.focus();
        }
        else
        {
            inputArea.value='';
            inputArea.focus();
        }
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
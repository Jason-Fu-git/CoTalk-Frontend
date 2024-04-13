import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from 'react';

import MessageCard from '@/components/MessageCard';
import { store } from "@/app/redux/store";

function Piazza()
{
    const url="ws://cotalkbackend-Concord.app.secoder.net/ws/"+
        "?Authorization="+store.getState().auth.token+
        "&user_id="+store.getState().auth.id;
    const chatSocket=new WebSocket(url);
    const [messages, setMessages]=useState([]);
    const [count, setCount]=useState(0);

    useEffect(()=> {
        console.log("REFRESH");
    }, [messages]);

    //客户端收到消息时触发
    chatSocket.onmessage=function(event) {
        const data=JSON.parse(event.data);
        
        //防止自己发给自己
        console.log("Frontend receive: ");
        console.log(event);
        //将新消息添加到后面
        const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
        const datetime=new Date(data.datetime).toLocaleString('en', dateOptions);
        const sender_name=data.sender_name;
        const sender_id=data.sender_id;
              
        const newMessages=[{
            'id': count,
            'sender_name': sender_name,
            'sender_id': sender_id,
            'message': data.message,
            'datetime': datetime,
        }].concat(messages);
            
        setCount(count+1);
        setMessages(newMessages);
    };

    chatSocket.onclose=function(event) {
        console.error('Chat socket closed unexpectedly');
    };

    chatSocket.onopen=function(event) {
        console.log("Open websocket");
    };

    const sendMessage=function(event) {
        let inputArea=document.getElementById('chat-message-input');
        const message=inputArea.value;
        if (message)
        {
            console.log("Frontend send: "+message);
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
                
                </h1>
                <div>
                {messages.map((message) => (
                        <div key={message.id}>
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

export default Piazza;
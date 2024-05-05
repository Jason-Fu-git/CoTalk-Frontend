import React, { useState, useEffect } from 'react';
import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';
import 'bootstrap/dist/css/bootstrap.css';

import MessageCard from '@/components/MessageCard';
import { store } from "@/app/redux/store";

function Piazza()
{
    const [messages, setMessages]=useState([]);
    const [count, setCount]=useState(0);

    useEffect(()=> {
        console.log("useEffect is called");

        const url="wss://cotalkbackend-Concord.app.secoder.net/ws/piazza";
        const chatSocket=new WebSocket(url);

        const generalUrl="ws://cotalkbackend-Concord.app.secoder.net/ws/main/"+store.getState().auth.id+"/";
        const generalSocket=new WebSocket(generalUrl);
    
        generalSocket.onmessage=function(event) {
            console.log('General websocket receive something');
        }
    
        generalSocket.onclose=function(event) {
            console.log('General socket closed');
        };
    
        generalSocket.onopen=function(event) {
            console.log("Open general websocket");
        };

        return () => {
            chatSocket.close();
            generalSocket.close();
        }
    }, [messages]);

    /*
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
    */

    const sendMessage=function(event) {
        let inputArea=document.getElementById('chat-message-input');
        const message=inputArea.value;
        if (message)
        {
            request(`${BACKEND_URL}/api/message/send`, "POST", true, 
                "application/json", {
                "user_id": store.getState().auth.id, 
                "chat_id": 0,
                "msg_text": message,
                "msg_type": "text",
            })
            .then((res) => {
                if (Number(res.code) === 0) {
                    console.log("Send successfully.");
                }
            })
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
                广场
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
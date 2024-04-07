import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function Piazza()
{
    let messages=[];
    // DOM loaded
    const url='ws://localhost:3000/ws/piazza';
    const chatSocket=new WebSocket(url);
    
    //客户端收到消息时触发
    chatSocket.onmessage=function(event) {
        const data=JSON.parse(event.data);
    
        //防止自己发给自己
        if (data.type)
        {
            console.log("Frontend receive: ");
            console.log(event);
            //将新消息添加到后面
            const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
            const datetime=new Date(data.datetime).toLocaleString('en', dateOptions);
            const name=data.user;
            
            messages.push({
                'sender': name,
                'text': data.message,
                'time': datetime,
            })
        }
    };
    
    chatSocket.onclose=function(event) {
        console.error('Chat socket closed unexpectedly');
    };

    const sendMessage=() => {
        let inputArea=document.getElementById('chat-message-input');
        const message=inputArea.value;
        if (message)
        {
            console.log("Frontend send:");
            console.log(message);
            chatSocket.send(JSON.stringify({'message':message}));
    
            let inputArea=document.getElementById('chat-message-input');
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
                        <div key={message.msg_id}>
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
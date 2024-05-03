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
    const {chatid}=router.query;
    const [messages, setMessages]=useState([]);

    const [count, setCount]=useState(0);
    // 第一次渲染时将所有已有消息标记为已读
    const [firstRender, setFirstRender]=useState(true);
    const [toggle, setToggle]=useState(true);

    const addMessage = (newMessage) => 
    {
        setMessages(oldMessages => 
        {
            if (!oldMessages.some(message => message.id === newMessage.id)) 
            {
                return [...oldMessages, newMessage];
            } 
            else 
            {
                return oldMessages;
            }
        });
        setCount(messages.length);
    };

    const replaceMessage = (newMessage, index) =>
    {

    }

    useEffect(()=> 
    {    
        const generalUrl="ws://cotalkbackend-Concord.app.secoder.net/ws/main/"+
        store.getState().auth.id+"/"+store.getState().auth.token;
        const generalSocket=new WebSocket(generalUrl);

        generalSocket.onmessage=async function(event) 
        {
            console.log("General socket receive something");
            const data=JSON.parse(event.data);
            console.log(data.type);
            console.log(data.status);
            
            if (!(data.type === "chat.message"))
            {
                return;
            }  

            if (data.status === "send message")
            {
                const sender_id=data.user_id;
                const chat_id=data.chat_id;
                const message_id=data.msg_id;
                if (!chat_id === chatid)
                {
                    return;
                }
                // 发送时间
                const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
                const datetime=new Date(data.update_time).toLocaleString('en', dateOptions);
                // 发送者
                let sender_name="??";
                await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                .then((res) => {
                    sender_name=res.user_name;
                });
    
                const message_url=`${BACKEND_URL}/api/message/${message_id}/management?user_id=`+store.getState().auth.id;
                const message=await request(message_url, "GET", true);
    
                addMessage({
                    'index': count,
                    'sender_name': sender_name,
                    'sender_id': sender_id,
                    'sender_avatar': '',
                  
                    'message': message.msg_text,
                    'message_id': message_id,
                  
                    'datetime': datetime,
                  
                    'onDelete': deleteMessage,
                    'onWithdrew': withdrewMessage,

                    'type': 'normal',
                });
                setToggle(!toggle);                
            }
            else if (data.status === "withdraw message")
            {

            }
        }

        generalSocket.onclose=function(event) 
        {
            console.log('General socket closed');
        };

        generalSocket.onopen=function(event) 
        {
            console.log("Open general websocket");
        };

        if (firstRender)
        {   
            console.log("Loading history for user "+store.getState().auth.id);
            const messages_url=`${BACKEND_URL}/api/chat/${chatid}/messages?user_id=`+store.getState().auth.id;
            
            request(messages_url, "GET", true)
            .then(async (res) => {
                const promises = res.messages.map(async function (element, index){
                    const sender_id=element.sender_id;
                    let sender_name="??";
                    await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                    .then((res) => {
                        sender_name=res.user_name;
                    });
                    const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
                    const datetime = new Date(element.create_time).toLocaleString('en', dateOptions);
            
                    // Mark as read
                    if (!element.read_users.includes(store.getState().auth.id)) 
                    {
                        await request(`${BACKEND_URL}/api/message/${element.msg_id}/management`,
                        "PUT", true, "application/json",
                        {
                            "user_id": store.getState().auth.id,
                        });
                    }
        
                    return ({
                        'index': index,
                        'sender_name': sender_name,
                        'sender_id': sender_id,
                        'sender_avatar': '',
                
                        'message': element.msg_text,
                        'message_id': element.msg_id,
        
                        'datetime': datetime,

                        'onDelete': deleteMessage,
                        'onWithdrew': withdrewMessage,

                        'type': 'normal',
                    });
                });
                const history = await Promise.all(promises);
                setMessages(history);
                setCount(history.length);
                console.log("History restored");
                console.log(history);
            });
            setFirstRender(false);
        }

        return () => {
            generalSocket.close();
        }
    }, [toggle]);

    const sendMessage=function(event) 
    {
        let inputArea=document.getElementById('chat-message-input');
        const message=inputArea.value;
        if (message)
        {
            // 通过Http发送一份
            console.log("Send Http");
            request(`${BACKEND_URL}/api/message/send`, "POST", true, "application/json", 
            {
                "user_id": store.getState().auth.id,
                "chat_id": chatid,
                "msg_text": message,
                "msg_type": "text",
            })
            .catch((err) =>
            {
                alert("发送失败");
                console.log(err);
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

    const deleteMessage=function(message_id) 
    {
        console.log("delete function called.");
		console.log("message id: "+message_id);
        
		request(`${BACKEND_URL}/api/message/${message_id}/management`,
				"DELETE", true, "application/json", 
			{
				"user_id": store.getState().auth.id,
				"is_remove": false,
			})
		.then((res) => 
        {
			alert("成功删除");
            setMessages((currentMessages) => 
            {
                const newMessages = currentMessages.filter(obj => (obj.message_id !== message_id));
                return newMessages;
            });
		})
        .catch((err) => 
        {
            alert("删除失败");
            console.log(err);
        })
    }

    const withdrewMessage=function (message_id)
    {
        console.log("Withdrew function called.");
		console.log("message id: "+message_id);
        
		request(`${BACKEND_URL}/api/message/${message_id}/management`,
				"DELETE", true, "application/json", 
			{
				"user_id": store.getState().auth.id,
				"is_remove": true,
			})
		.then((res) => 
        {
			alert("成功撤回");
            setMessages((currentMessages) => 
            {
                const newMessages = currentMessages.filter(obj => (obj.message_id !== message_id));
                return newMessages;
            });
		})
        .catch((err) =>
        {
            alert("无法撤回");
            console.log(err);
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
                <Link href={`/chat/${chatid}/search_history`} passHref>
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
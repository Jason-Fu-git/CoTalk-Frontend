import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import Link from 'next/link';

import ChatCard from '@/components/ChatCard';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";

function Chats() 
{
    const [chats, setChats] = useState([]);

    useEffect(() => 
    {
        console.log("Loading chats");
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/chats`, "GET", true)
        .then(async (res) => 
        {
            const promises = res.chats.map(async function (chat, index)
            {
                const chat_name=chat.chat_name;
                const chat_id=chat.chat_id;

                const my_id=store.getState().auth.id;
                const url=`${BACKEND_URL}/api/chat/${chat_id}/messages?`+
                    "user_id="+my_id;

                let unread_count=0;
                await request(url, "GET", true)
                .then((res) => {
                    res.messages.forEach(function (message)
                    {
                        if (!message.read_users.includes(my_id))
                        {
                            unread_count=unread_count+1;
                        }
                    })
                });
    
                return ({
                    'chat_name': chat_name,
                    'chat_id': chat_id,

                    'unread_count': unread_count,
                });
            });
            const myChats = await Promise.all(promises);
            setChats(myChats);
            console.log("Finish loading chats: ");
            console.log(myChats);
        });
    }, []);

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    所有群聊
                </h1>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    <Link href={`/chat/create`} passHref>
                        <div className="card" style={{width: "18rem"}}>
                            <div className="card-body">
                            <h5 className="card-title">创建群聊</h5>
                            </div>
                        </div>
                    </Link>
                    {chats.map((chat) => (
                        <div key={chat.chat_id}>
                            <ChatCard {...chat}/>
                        </div>
                    ))}
                </div>
            </div> 
        </>
    )
}

export default Chats;
'use client'
import React,{useState} from "react";
import { BACKEND_URL } from "@/app/constants/string";
import { request } from "@/app/utils/network";
export default function Chatpage({ params }: { params: { userid: number } }) {
    const [chats, setChats] = useState([]);
    request(`${BACKEND_URL}/api/user/${params.userid}/chats`, "GET", true)
    .then((res) => {
        setChats(res.chats);
    }
    );
    return (
        <div>
            <p>Chat page</p>
            {chats.length > 0 ? (
                chats.map((chat) => (
                    <div key={chat.chat_id}>
                        <p>Chat id: {chat.chat_id}</p>
                        <p>Chat name: {chat.chat_name}</p>
                    </div>
                ))
            ) : (
                <p>还没有聊天</p>
            )}
        </div>
    );
}
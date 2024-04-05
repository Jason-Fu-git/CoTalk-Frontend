import 'bootstrap/dist/css/bootstrap.css';
import ChatCard from '@/components/ChatCard';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState,useEffect } from "react";
import {request} from "@/app/utils/network";
import { store } from "@/app/redux/store";
import Link from 'next/link';

export async function getServerSideProps(ctx) {
    const { userid }=ctx.query;
//    const chatsReq=await axios.get(`${BACKEND_URL}/api/user/${userid}/chats`);
    
    const chatsReq={
        "data": [
            {
                "chat_id":1,
                "chat_name":"群聊1",
            },
            {
                "chat_id":2,
                "chat_name":"群聊2",
            },
        ]
    }
    return {
        props: {
            chats: chatsReq.data
        }
    }
}

function Chats({ chats }) 
{
    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    所有群聊
                </h1>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
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
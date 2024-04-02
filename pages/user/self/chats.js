import Link from 'next/link';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState } from "react";
import {request} from "@/app/utils/network";
import 'bootstrap/dist/css/bootstrap.css'

export async function getServerSideProps(ctx) {
    const { userid }=ctx.query;
//    const chatsReq=await axios.get(`${BACKEND_URL}/api/user/${userid}/chats`);
    
    const chatsReq={
        "data": [
            {
                "user_id":1,
                "chat_name":"群聊1",
            },
            {
                "user_id":2,
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

function Chats({ chats }) {
    return (
        <>
            <p className="lead">所有好友</p>
            <ul>
            {
                chats.map((chat) =>
                    <li key={chat.user_id}>
                        <Link
                            href={'/'}
                            passHref
                        >
                        {chat.chat_name}
                        </Link>
                    </li>
                )
            }
            </ul>
        </>
    )
}

export default Chats;
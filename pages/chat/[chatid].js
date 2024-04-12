import 'bootstrap/dist/css/bootstrap.css';
import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState,useEffect } from "react";
import {useRouter} from 'next/router';
import {request} from "@/app/utils/network";
import { store } from "@/app/redux/store";
import Link from 'next/link';


function Chat() 
{
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const {chatid} = router.query;
    useEffect(() => {
        request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
        .then((res) => {
        setMembers(res.members);
        });
    }, []);

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    群聊信息
                </h1>
                <h1 className="
                    dark:text-white text-3xl font-bold text-center">
                    所有成员
                </h1>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {members.map((user) => (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                        </div>
                    ))}
                </div>
            </div> 
        </>
    )
}

export default Chat;
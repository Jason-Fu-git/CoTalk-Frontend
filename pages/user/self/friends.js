import 'bootstrap/dist/css/bootstrap.css';
import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState,useEffect } from "react";
import {request} from "@/app/utils/network";
import { store } from "@/app/redux/store";
import Link from 'next/link';

function Friends() 
{
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        request(`${BACKEND_URL}/api/user/${store.getState().auth.id}/friends`, "GET", true)
        .then((res) => {
        setFriends(res.friends);
        });
    }, []);

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    所有好友
                </h1>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {friends.map((user) => (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                        </div>
                    ))}
                </div>
            </div> 
            <Link href={`/user/search`} passHref>
                <button className="
                    dark:bg-blue-400
                    dark:text-gray-800
                    bg-blue-400
                    text-white
                    font-semibold
                    p-2
                    rounded-md
                    mt-6">
                  搜索用户
                </button>
            </Link>
        </>
    )
}

export default Friends;
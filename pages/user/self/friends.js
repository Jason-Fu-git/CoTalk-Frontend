import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';

import UserCard from '@/components/UserCard';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";
import search from "@/public/Search.jpg";
import { setFriends } from "@/app/redux/auth";

function Friends() 
{
    const [friends, setMyFriends] = useState([]);

    useEffect(() => {
        console.log("Get "+store.getState().auth.name+"'s friends");
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
        .then((res) => {
            setMyFriends(res.friends);
            let friend_ids=[];
            res.friends.forEach(function (element, index, array){
                friend_ids.push(element.user_id);
                element.is_friend=true;
            });
            console.log(friend_ids);
            store.dispatch(setFriends(friend_ids));
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
                    <Link href={`/user/search`} passHref>
                        <div className="card" style={{width: "18rem"}}>
                            <Image
                                src={search}
                                className="card-img-top" 
                                alt="search new users"
                            />
                            <div className="card-body">
                            <h5 className="card-title">搜索用户</h5>
                            </div>
                        </div>
                    </Link>
                    {friends.map((user) => (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                        </div>
                    ))}
                </div>
            </div> 
        </>
    )
}

export default Friends;
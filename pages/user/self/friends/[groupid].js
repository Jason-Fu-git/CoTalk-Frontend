import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import {useRouter} from 'next/router';
import UserCard from '@/components/UserCard';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";


export default function Friendgroup(){
    const router = useRouter();
    const [friends, setMyFriends] = useState([]);
    const {groupid} = router.query;
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
        .then((res) => {
            res.friends.forEach(function (element){
                if(element.group===groupid){
                    setMyFriends([...friends, element]);
                }
            });
        });
    }, []);
    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    {groupid}
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
        </>
    )
}
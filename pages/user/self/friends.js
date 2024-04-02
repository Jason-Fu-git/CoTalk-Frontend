import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css'
import UserCard from '../../../components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState } from "react";
import {request} from "@/app/utils/network";
import { store } from "@/app/redux/store";

/*
export async function getServerSideProps(ctx) {
    const { userid }=ctx.query;
//    const friendsReq=await axios.get(`${BACKEND_URL}/api/user/${userid}/friends`);
    const friendsReq={
        "data": [
            {
                "user_name":"Test1",
                "user_id":1,
                "user_email":"test1@xxx.com",
            },
            {
                "user_name":"Test2",
                "user_id":2,
                "user_email":"test2@xxx.com"
            },
        ]
    }
    return {
        props: {
            friends: friendsReq.data
        }
    }
}
*/

function Friends() 
{
    console.log(store.getState().auth.token);
    const [friends, setFriends] = useState([]);
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    request(`${BACKEND_URL}/api/user/${store.getState().auth.id}/friends`, "GET", true)
    .then((res) => {
      setFriends(res.friends);
    });

    const handleSearch = () => {
        setHasSearched(true);
        request(`${BACKEND_URL}/api/user/?search_text=${query}`, "GET", false)
        .then((res) => {
            setSearchResult(res.friends);
        });
    };

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-5xl font-bold text-center">
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
        </>
    )
}

export default Friends;
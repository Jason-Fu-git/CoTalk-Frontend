import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from "react";
import Link from 'next/link';

import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";
import {setFriends} from "@/app/redux/auth";

function Friends() {
    const [friends, setMyFriends] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        console.log("Get " + store.getState().auth.name + "'s friends");
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
            .then((res) => {
                setMyFriends(res.friends);
                let friend_ids = [];
                let group_ids = [];
                res.friends.forEach(function (element) {
                    friend_ids.push(element.user_id);
                    element.user_tag = "好友";
                    //如果groups里不包含element.group,则将element.group加入groups
                    if (element.group != "ungrouped" && !group_ids.includes(element.group)) {
                        group_ids.push(element.group);
                    }
                });
                setGroups(group_ids);
                console.log(friend_ids);
                store.dispatch(setFriends(friend_ids));
            });
    }, []);

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center"
                    style={{marginBottom: "20px"}}>
                    所有好友
                </h1>
                <div style={{margin: "auto", textAlign: "center"}}>
                    <Link href={`/user/search`} style={{margin: "auto", textAlign: "center"}} passHref>
                        搜索用户
                    </Link>
                </div>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {friends.map((user) => (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                        </div>
                    ))}
                </div>

                <h1 className="
                    dark:text-white text-4xl font-bold text-center"
                    style={{marginBottom: "20px"}}>
                    好友分组
                </h1>
                <div style={{margin: "auto", textAlign: "center"}}>
                    <Link href={`/user/self/friends/create_group`} passHref>
                        新建分组
                    </Link>
                </div>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {groups.map((group, index) => (
                        <div key={index}>
                            <Link href={`/user/self/friends/${group}`} passHref key={group}>
                                <div className="card" style={{width: "18rem"}}>
                                    <div className="card-body">
                                        <h5 className="card-title">{group}</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Friends;
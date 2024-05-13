import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';
import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";


export default function Friendgroup() {
    const router = useRouter();
    const [groupmembers, setgroupmembers] = useState([]);
    const [friends, setMyFriends] = useState([]);
    const [memberid, setMemberid] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [flash, setFlash] = useState(false);
    let groupid=0;
    useEffect(() => {
        groupid = localStorage.getItem("groupid");
        if(router.query.groupid){
            groupid = router.query.groupid;
            localStorage.setItem("groupid", groupid);
        }

        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
            .then((res1) => {
                request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
                    .then((res) => {
                        const newFriends = res.friends.filter(element => element.group === groupid);
                        setgroupmembers(newFriends);
                        const member = res.friends.filter(element => element.group !== groupid);
                        setMyFriends(member);
                        setShowModel(true);
                    });
            });

    }, [flash]);
    const invitefriends = async () => {
        const promises = memberid.map(id =>
            request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "PUT", true, "application/json", {
                "friend_id": id,
                "group": groupid
            })
        );
        await Promise.all(promises);
        setFlash(!flash);
    }
    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    {groupid}
                </h1>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {groupmembers.map((user) => (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                        </div>
                    ))}
                </div>
                <h1 className="
                dark:text-white text-4xl font-bold text-center">
                    为分组添加好友
                </h1>
                <div style={{textAlign: "center", margin: "20px"}}>
                    <button
                        className="btn btn-primary"
                        disabled={memberid.length === 0}
                        onClick={invitefriends}>
                        添加好友
                    </button>
                </div>
                {showModel && (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                        {friends.map((friend, index) => (
                            <div key={index}>
                                <input
                                    type="checkbox"
                                    className="btn-check"
                                    autoComplete="off"
                                    id={friend.user_id}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setMemberid([...memberid, friend.user_id]);
                                        } else {
                                            setMemberid(memberid.filter(id => id !== friend.user_id));
                                        }
                                    }}/>
                                <label
                                    className="btn btn-outline-primary"
                                    htmlFor={friend.user_id}>
                                    选择
                                </label>
                                <div key={friend.user_id}>
                                    <UserCard {...friend}/>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';

import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";
import UserCard from '@/components/UserCard';

function InvitePage() {
    const router = useRouter();
    const [friends, setMyFriends] = useState([]);
    const [memberid, setMemberid] = useState([]);
    const [showModel, setShowModel] = useState(false);
    let chatid=0;
    useEffect(() => {
        chatid = localStorage.getItem("chatid");
        if(router.query.chatid){
            chatid=router.query.chatid;
            localStorage.setItem("chatid", chatid);
        }
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
            .then((res1) => {
                request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
                    .then((res2) => {
                        let member = []
                        res2.members.forEach(function (element) {
                            member.push(element.user_id);
                        });
                        setMyFriends(res1.friends.filter(friend => !member.includes(friend.user_id)));
                        setShowModel(true);
                    });
            });
    }, []);
    const invitefriends = () => {
        for (let i = 0; i < memberid.length; i++) {
            request(`${BACKEND_URL}/api/chat/${chatid}/members`, "PUT", true, "application/json", {
                "user_id": store.getState().auth.id,
                "member_id": memberid[i]
            })
        }
        router.push(`/chat/${chatid}`);
    }
    return (
        <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
            <h1 className="
                dark:text-white text-4xl font-bold text-center">
                邀请好友加入群聊
            </h1>

            <div className="input-group mb-3">
                <div className="col-auto">
                    <button
                        className="btn btn-primary"
                        disabled={memberid.length === 0}
                        onClick={invitefriends}>
                        邀请好友
                    </button>
                </div>
            </div>

            {showModel && (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {friends.map((friend, index) => (
                        <div key={index}>
                            <div>
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
                            </div>
                            <div key={friend.user_id}>
                                <UserCard {...friend}/>
                            </div>
                        </div>

                    ))}
                </div>
            )}


        </div>
    )
}

export default InvitePage;
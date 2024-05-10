import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from "react";

import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";
import {useRouter} from "next/router";
import UserCard from '@/components/UserCard';

export default function Createpage() {
    const [chatName, setChatName] = useState("");
    const [memberid, setMemberid] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const selfid = store.getState().auth.id;
    const router = useRouter();
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${selfid}/friends`, "GET", true)
            .then((res) => {
                setFriends(res.friends);
                console.log("Friends: " + res.friends);
                setShowModel(true);
            });
    }, []);

    const createChat = () => {
        request(`${BACKEND_URL}/api/chat/create`, "POST", true, "application/json", {
            "user_id": selfid,
            "chat_name": chatName,
            "members": memberid
        })
            .then((res) => {
                if (Number(res.code) === 0) {
                    alert("创建成功");
                    router.push(`/chat/${res.chat_id}/conversation`);
                }
            });
    }

    return (
        <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
            <h1 className="
                dark:text-white text-4xl font-bold text-center">
                创建群聊
            </h1>

            <div className="input-group mb-3" style={{margin:"40px"}}>
                <input
                    className="form-control col_auto"
                    type="text"
                    placeholder="请输入群聊名称"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                />
                <div className="col-auto">
                    <button
                        className="btn btn-primary"
                        disabled={chatName === '' || memberid.length === 0}
                        onClick={createChat}>
                        创建群聊
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
                                    }}
                                />
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
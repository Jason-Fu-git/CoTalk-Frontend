import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import {useRouter} from 'next/router';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";
function InvitePage()
{
    const router = useRouter();
    const {chatid}=router.query;
    const [friends, setMyFriends] = useState([]);
    const [memberid, setMemberid] = useState([]);
    const [showModel, setShowModel] = useState(false);
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "GET", true)
        .then((res1) => {
            setMyFriends(res1.friends);
            console.log(res1.friends);
            request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
            .then((res2) => {
                let member=[]
                res2.members.forEach(function(element){
                    member.push(element.user_id);
                });
                setMyFriends(res1.friends.filter(friend => !member.includes(friend.user_id)));
                setShowModel(true);
            });  
        });
    }, []);
    const invitefriends = () => {
        for(let i=0;i<memberid.length;i++){
            request(`${BACKEND_URL}/api/chat/${chatid}/members`, "PUT", true,"application/json",{
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
            {showModel && (
                <div>
                    {friends.map((friend) => (
                        <div class="form-check" key={friend.user_id}>
                        <input 
                            type="checkbox" 
                            class="btn-check" 
                            id="btn-check-outlined" 
                            autocomplete="off"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setMemberid([...memberid, friend.user_id]);
                                } else {
                                    setMemberid(memberid.filter(id => id !== friend.user_id));
                                }
                            }}/>
                        <label class="btn btn-outline-primary" for="btn-check-outlined">
                        {friend.user_name}
                        </label>
                        </div>
                    ))}
                </div>
            )}

            <div className="input-group mb-3">
                <div className="col-auto">
                    <button 
                        className="btn btn-primary"
                        disabled={memberid.length===0}
                        onClick={invitefriends}>
                        邀请好友
                    </button>
                </div>
            </div>
        </div>
    ) 
}

export default InvitePage;
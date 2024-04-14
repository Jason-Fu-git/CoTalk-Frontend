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
    const [my_privilege, setMyPrivilege] = useState("");
    const {chatid} = router.query;
    const my_friends = store.getState().auth.friends;
    const my_id=store.getState().auth.id;

    useEffect(() => {
        request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
        .then((res) => {
            res.members.forEach(function (element, index, array){
                setMyPrivilege(element.privilege);
                if (element.privilege === "owner")
                {
                    element.user_tag="群主";
                }
                else if (element.privilege === "admin")
                {
                    element.user_tag="管理员";
                }
                else
                {
                    element.user_tag="成员";
                }
            });
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
                {
                    (my_privilege === "owner") ? (
                        <div>
                            <Link href={`chat/${chatid}/owner`} passHref>
                                <button className="btn btn-secondary">
                                以群主身份管理
                                </button>
                            </Link>
                        </div>) : (<></>)
                }
                {
                    (my_privilege === "admin") ? (
                        <div>
                            <Link href={`chat/${chatid}/admin`} passHref>
                                <button className="btn btn-secondary">
                                以管理员身份管理
                                </button>
                            </Link>
                        </div>) : (<></>)
                }
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    <Link href={`/chat/${chatid}/invite`} passHref>
                        <div className="card" style={{width: "18rem"}}>
                            <div className="card-body">
                            <h5 className="card-title">邀请好友</h5>
                            </div>
                        </div>
                    </Link>
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
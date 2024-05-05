import 'bootstrap/dist/css/bootstrap.css';
import React, { useState,useEffect, useRef } from "react";
import {useRouter} from 'next/router';
import Link from 'next/link';

import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import { store } from "@/app/redux/store";

function Chat() 
{
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [my_privilege, setMyPrivilege] = useState("");
    const [toggle, setToggle]=useState(true);
    const [notice, setNotice]=useState("没有群公告");

    const {chatid} = router.query;
    const my_friends = store.getState().auth.friends;
    const my_id=store.getState().auth.id;

    const updateMembers=function(m)
    {
        setMembers(()=>
        {
            return m;
        });
    }

    useEffect(() => 
    {
        request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
        .then((res) => 
        {
            res.members.forEach(function (element)
            {
                if (element.user_id === my_id)
                {
                    setMyPrivilege(element.privilege);
                }
                if (element.privilege === "O")
                {
                    element.user_tag="群主";
                }
                else if (element.privilege === "A")
                {
                    element.user_tag="管理员";
                }
                else
                {
                    element.user_tag="成员";
                }
            });
            updateMembers(res.members);
            console.log(res.members);
        });

        const url=`${BACKEND_URL}/api/chat/${chatid}/messages?user_id=`+
        store.getState().auth.id+"&filter_type=group_notice";

        console.log("Loading search result: "+url);

        request(url, "GET", true)
        .then((res) => 
        {
            if (res.messages.length>0)
            {

            }
        });
    }, [toggle]);

    const makeAdmin = function (user_id)
    {
        // 将user_id指定为管理员

        setToggle(!toggle);
    }

    const unmakeAdmin = function (user_id)
    {
        // 将user_id从管理员变成普通成员

        setToggle(!toggle);
    }

    const kick = function (user_id)
    {
        // 将user_id踢出群聊

        setToggle(!toggle);
    }

    const sendNotice = function ()
    {
        // 将message作为群公告发出
        let inputArea=document.getElementById('notice-input');
        const message=inputArea.value;
        if (message === '')
        {
            alert("群公告不能为空");
            return;
        }

        setNotice(message);
        inputArea.value='';
        inputArea.focus();
        setToggle(!toggle);
    }

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    群聊信息
                </h1>
                <h1 className="
                    dark:text-white text-3xl font-bold text-center">
                    群公告
                </h1>
                <p>{notice}</p>
                {
                    (my_privilege === 'O')&&(
                        <button 
                            class="btn btn-secondary"
                            data-bs-toggle="modal" 
                            data-bs-target="#noticeModal">
                        发布群公告
                        </button>
                )}
                <h1 className="
                    dark:text-white text-3xl font-bold text-center">
                    所有成员
                </h1>
                {
                    (my_privilege !== 'O')&&(
                        <button 
                            className="btn btn-secondary"
                            onClick={()=>{

                            }}>
                            退出群聊
                        </button>
                    )
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
                    {members.map((user) => 
                    (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                            {
                                (user.user_id !== my_id)&&(my_privilege === 'O')
                                &&(user.privilege === 'M')&&(
                                    <div class="btn-group" role="group">
                                    <button 
                                        type="button" class="btn btn-danger"
                                        onClick={()=>kick(user.user_id)}>踢出</button>
                                    <button 
                                        type="button" class="btn btn-success"
                                        onClick={()=>makeAdmin(user.user_id)}>提拔为管理员</button>
                                    </div>
                                )
                            }
                            {
                                (user.user_id !== my_id)&&(my_privilege === 'A')
                                &&(user.privilege === 'M')&&(
                                    <div class="btn-group" role="group">
                                    <button 
                                        type="button" class="btn btn-danger"
                                        onClick={()=>kick(user.user_id)}>踢出</button>
                                    </div>
                                )                                
                            }
                            {
                                (user.user_id !== my_id)&&(my_privilege === 'O')
                                &&(user.privilege === 'A')&&(
                                    <div class="btn-group" role="group">
                                    <button 
                                        type="button" class="btn btn-danger"
                                        onClick={()=>kick(user.user_id)}>踢出</button>
                                    <button 
                                        type="button" class="btn btn-warning"
                                        onClick={()=>unmakeAdmin(user.user_id)}>降级为普通成员</button>
                                    </div>
                                )                                
                            }
                        </div>
                    ))}
                </div>
            </div> 

            <div 
                class="modal fade" 
                id="noticeModal" 
                tabindex="-1" 
                aria-labelledby="exampleModalLabel" 
                aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" 
							id="exampleModalLabel">
							发布群公告
							</h5>
							<button 
								type="button" 
								class="btn-close" 
								data-bs-dismiss="modal"
								aria-label="Close">
							</button>
						</div>
						<div class="modal-body">
						    <textarea
								className="form-control col_auto"
								type="text"
								placeholder="请输入群公告"
								id="notice-input"
								rows="5"
							/>
						</div>
						<div class="modal-footer">
							<button 
								type="button" 
								class="btn btn-primary"
								onClick={()=>sendNotice()}>
							发布
							</button>
						</div>
					</div>
				</div>
			</div>
        </>
    )
}

export default Chat;
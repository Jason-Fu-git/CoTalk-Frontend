import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect, useRef} from "react";
import {useRouter} from 'next/router';
import Link from 'next/link';

import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";

function Chat() {
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [my_privilege, setMyPrivilege] = useState("");
    const [toggle, setToggle] = useState(true);
    const [notices, setNotices] = useState([]);
    const [notice, setNotice] = useState("");
    const [editNotice, setEditNotice] = useState(false);

    let chatid = 0;
    if (router.query.chatid) {
        chatid = router.query.chatid;
        localStorage.setItem("chatid", chatid);
    }
    const my_friends = store.getState().auth.friends;
    const my_id = store.getState().auth.id;

    const updateMembers = function (m) {
        setMembers(() => {
            return m;
        });
    }

    const handleNoticeChange = (event) => {
        setNotice(event.target.value);
    };

    useEffect(() => {
        chatid = localStorage.getItem("chatid");
        if (router.query.chatid) {
            chatid = router.query.chatid;
            localStorage.setItem("chatid", chatid);
        }

        request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
            .then((res) => {
                res.members.forEach(function (element) {
                    if (element.user_id === my_id) {
                        setMyPrivilege(element.privilege);
                    }
                    if (element.privilege === "O") {
                        element.user_tag = "群主";
                    } else if (element.privilege === "A") {
                        element.user_tag = "管理员";
                    } else {
                        element.user_tag = "成员";
                    }
                });
                updateMembers(res.members);
            });

        const url = `${BACKEND_URL}/api/chat/${chatid}/messages?user_id=` +
            store.getState().auth.id + "&filter_type=group_notice";

        console.log("Loading search result: " + url);

        request(url, "GET", true)
            .then((res) => {
                if (res.messages.length>0)
                {
                    const ntcs=res.messages.map((element)=>
                        ({
                            'text': element.msg_text,
                            'id': element.msg_id,
                        }));
                    setNotices(ntcs);
                }
                else
                {
                    setNotices([]);
                }
            });
    }, [toggle]);

    const makeAdmin = function (user_id)
    {
        // 将user_id指定为管理员
        request(`${BACKEND_URL}/api/chat/${chatid}/management`, "PUT", true, "application/json", {
            "user_id": my_id,
            "member_id": user_id,
            "change_to": "admin"
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("提拔成功");
            }
            setToggle(!toggle);
        });
    }

    const unmakeAdmin = function (user_id)
    {
        // 将user_id从管理员变成普通成员
        request(`${BACKEND_URL}/api/chat/${chatid}/management`, "PUT", true, "application/json", {
            "user_id": my_id,
            "member_id": user_id,
            "change_to": "member"
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("降级成功");
            }
            setToggle(!toggle);
        });
    }
    const makeOwner = function (user_id) 
    {
        // 将user_id指定为群主
        request(`${BACKEND_URL}/api/chat/${chatid}/management`, "PUT", true, "application/json", {
            "user_id": my_id,
            "member_id": user_id,
            "change_to": "owner"
        })
        .then((res) => {
                alert("移交成功");
                setToggle(!toggle);
        })
        .catch((err)=>{
            alert("移交失败");
        });
    }
    const kick = function (user_id) 
    {
        // 将user_id踢出群聊
        request(`${BACKEND_URL}/api/chat/${chatid}/members`, "PUT", true, "application/json", {
            "user_id": my_id,
            "member_id": user_id,
            "approve": false
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("踢出成功");
            }
            setToggle(!toggle);
        })
        .catch((err)=>
        {
            alert("踢出失败");
        });
    }
    const sendNotice = function () 
    {
        // 将message作为群公告发出
        if (notice === '') {
            alert("群公告不能为空");
            setEditNotice(false);
            setToggle(!toggle);
            return;
        }
        request(`${BACKEND_URL}/api/message/send`, "POST", true, "application/json", {
            "user_id": my_id,
            "chat_id": chatid,
            "msg_text": notice,
            "msg_type": "group_notice"
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                setNotice("");
                alert("群公告发布成功");
            }
            setEditNotice(false);
            setToggle(!toggle);
        })
        .catch((err)=>{
            alert("发布失败");
        });
    }

    const exit = function () 
    {
        // 退出群聊
        request(`${BACKEND_URL}/api/user/private/${my_id}/chats`, "DELETE", true, "application/json", {
            "chat_id": chatid
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("退出成功");
                router.push("/user/self/chats");
            }
        })
        .catch((err)=>{
            alert("退出失败");
        });
    }

    const onDelete = function(notice_id)
    {
        console.log("DELETE");
        request(`${BACKEND_URL}/api/message/${notice_id}/management`,
            "DELETE", true, "application/json",
            {
                "user_id": store.getState().auth.id,
                "is_remove": false,
            })
        .then((res) => {
            alert("成功删除");
            setToggle(!toggle);
        })
        .catch((err) => {
            alert("删除失败");
        });
    }

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    群聊信息
                </h1>
                <h1 className="
                    dark:text-white text-3xl font-bold text-center"
                    style={{marginTop: '40px'}}>
                    群公告
                </h1>
                {
                    notices.map((element, index)=>{
                        return (
                            <div 
                                style={{textAlign: 'center', margin: "20px"}}
                                key={index}>
                                <span style={{
                                    display: "inline-block",
                                    background: '#f2f2f2',
                                    padding: '10px',
                                    borderRadius: '10px'
                                }}>{element.text}</span>
                                <button 
                                    type="button" 
                                    className="btn btn-close"
                                    onClick={()=>{
                                        onDelete(element.id);
                                    }}>
                                </button>
                            </div>
                        )
                    })
                }

                <div style={{textAlign: 'center', margin: "20px"}}>
                    {
                        ((my_privilege === 'O')||(my_privilege === 'A')) && (!editNotice) && (
                            <>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditNotice(true);
                                        setToggle(!toggle);
                                    }}>
                                发布群公告
                                </button>
                            </>
                        )}
                </div>

                {
                    editNotice && (
                        <div
                            className="list-group-item"
                            style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                            <input
                                className="form-control col_auto"
                                type="text"
                                placeHolder="请输入群公告内容"
                                value={notice}
                                onChange={handleNoticeChange}
                            />
                            <div className="col-auto">
                                <button
                                    name="submit"
                                    className="btn btn-primary"
                                    onClick={() => sendNotice()}
                                >
                                发送
                                </button>
                            </div>
                            <div className="col-auto">
                                <button
                                    name="submit"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setEditNotice(false);
                                        setToggle(!toggle);
                                    }}
                                >
                                取消
                                </button>
                            </div>
                        </div>
                    )}
                <h1 className="
                    dark:text-white text-3xl font-bold text-center"
                    style={{marginTop: '40px'}}>
                    所有成员
                </h1>
                <div style={{textAlign: 'center', marginTop: '10px'}}>
                    <button
                        style={{margin: '10px'}}
                        className="btn btn-link"
                        onClick={() => exit()}>
                        退出群聊
                    </button>
                    <button
                        style={{margin: '10px'}}
                        className="btn btn-link">
                    <Link href={`/chat/${chatid}/invite`}  passHref>
                        邀请好友
                    </Link>                   
                    </button>
                </div>

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {members.map((user) =>
                        (
                            <div key={user.user_id}>
                                <UserCard {...user}/>
                                {
                                    (user.user_id !== my_id) && (my_privilege === 'O')
                                    && (user.privilege === 'M') && (
                                        <div className="btn-group" role="group">
                                            <button
                                                type="button" className="btn btn-danger"
                                                onClick={() => kick(user.user_id)}>踢出
                                            </button>
                                            <button
                                                type="button" className="btn btn-success"
                                                onClick={() => makeAdmin(user.user_id)}>提拔为管理员
                                            </button>
                                            <button
                                                type="button" className="btn btn-secondary"
                                                onClick={() => makeOwner(user.user_id)}>转让群主
                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    (user.user_id !== my_id) && (my_privilege === 'A')
                                    && (user.privilege === 'M') && (
                                        <div className="btn-group" role="group">
                                            <button
                                                type="button" className="btn btn-danger"
                                                onClick={() => kick(user.user_id)}>踢出
                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    (user.user_id !== my_id) && (my_privilege === 'O')
                                    && (user.privilege === 'A') && (
                                        <div className="btn-group" role="group">
                                            <button
                                                type="button" className="btn btn-danger"
                                                onClick={() => kick(user.user_id)}>踢出
                                            </button>
                                            <button
                                                type="button" className="btn btn-warning"
                                                onClick={() => unmakeAdmin(user.user_id)}>降级为普通成员
                                            </button>
                                            <button
                                                type="button" className="btn btn-success"
                                                onClick={() => makeOwner(user.user_id)}>转让群主
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export default Chat;
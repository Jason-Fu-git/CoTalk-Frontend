import React, { useState , useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';

import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';
import { store } from "@/app/redux/store";
import { setFriends } from "@/app/redux/auth";

export default function Notification() {
    const [notifications, set_notifications] = useState([]);
    const [flash, set_flash] = useState(false);
    const self_id = store.getState().auth.id;

    useEffect(() => {
        const later_than=0;
        const only_unread=false;
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notifications?only_unread=${only_unread}&later_than=${later_than}`, "GET", true)
        .then(async (res) => {
            const promises = res.notifications.map(async function (element){
                // modify every notification
                element.content = JSON.parse(element.content.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false')); // Replace single quotes with double quotes
                // set the sender's name
                const sender_id=element.sender_id;

                let sender_name="??";
                await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                .then((res) => {
                    sender_name=res.user_name;
                    element.sender_name=sender_name; // Add new property to element
                });
                
                // set the notification's content
                switch ((element.content.type, element.content.status)) {
                    case ("user.friend.request", "make request"):
                        element.header="好友申请";
                        element.message=element.sender_name+" 想成为你的好友";
                        break;
                    case ("user.friend.request", "accept request"):
                        element.header="好友申请";
                        element.message="已同意 "+element.sender_name+" 的好友申请";
                        break;
                    case ("chat.management", "make invitation"):
                        element.header="群聊邀请";
                        element.message=element.sender_name+" 邀请你加入群聊";
                        break;
                }
                return element;
            });
            const notifications = await Promise.all(promises);
            set_notifications(notifications);
        });
    }, [flash]);

    const deleteNotification = (notification_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification/${notification_id}`, "DELETE", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("删除成功");
            }
        });
    }

    const markAsRead = (notification_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification/${notification_id}`, "PUT", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("标记成功");
            }
        });
    }
    
    const approveFriend = (friend_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "PUT", true,"application/json",
        {
            "friend_id": friend_id,
            "approve": true
          })
        .then((res) => {
            if (Number(res.code) === 0) {
                store.dispatch(setFriends([...store.getState().auth.friends, friend_id]));
                alert("好友申请已同意");
            }
        });
    }

    const approveChat = (chat_id,sender_id) => {
        request(`${BACKEND_URL}/api/chat/${chat_id}/members`, "PUT", true,"application/json",
        {
            "user_id": self_id,
            "member_id": self_id,
            "approve": true
          })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("已加入聊天室");
            }
        });
    }

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                收件箱
                </h1>
                <button 
                    className="btn btn-secondary"
                    onClick={() => set_flash(!flash)}>
                刷新
                </button>
                <div>
                </div>
                    {notifications.map((notification,index) => (
                        <div key={index}>
                            <div class="card">
                                <div class="card-header">
                                    {notification.header}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">{notification.message}</h5>
                                </div>  
                                <div className="row gx-1">
                                    <div className="col">
                                        {
                                            notification.is_read === false && 
                                            (
                                                <button 
                                                    name="markAsRead"
                                                    className="btn btn-secondary"
                                                    onClick={() => {
                                                        markAsRead(notification.notification_id);
                                                        set_flash(!flash);}}
                                                >
                                                    标记为已读
                                                </button>
                                            )
                                        }
                                        {
                                            notification.is_read === true && (
                                            <span>已读</span>
                                        )}
                                        {   
                                            !store.getState().auth.friends.includes(notification.sender_id) && 
                                            notification.content.status === "make request" &&
                                            (
                                                <button
                                                    name="approve_friend"
                                                    className="btn btn-success"
                                                    onClick={() => {
                                                        approveFriend(notification.sender_id);
                                                        set_flash(!flash);}}
                                                >
                                                    同意
                                                </button>
                                            )
                                        }
                                        {
                                            notification.content.status === "make invitation" &&
                                            (
                                                <button
                                                name="approve_chat"
                                                className="btn btn-success"
                                                onClick={() => {
                                                    approveChat(notification.content.chat_id, notification.sender_id);
                                                    set_flash(!flash);}}
                                                >
                                                    同意聊天室邀请
                                                </button>
                                            )
                                        }
                                        <button 
                                            name="delete"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                deleteNotification(notification.notification_id)
                                                set_flash(!flash);}}>
                                            删除此条通知
                                        </button>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
}

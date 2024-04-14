import React, { useState , useEffect } from "react";

import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';
import { store } from "@/app/redux/store";
import { setFriends } from "@/app/redux/auth";
export default function Notification() {
    const [notifications, set_notifications] = useState([]);
    const [flash, set_flash] = useState(false);
    
    useEffect(() => {
        const later_than=0;
        const only_unread=false;
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notifications?only_unread=${only_unread}&later_than=${later_than}`, "GET", true)
        .then(async (res) => {
            const promises = res.notifications.map(async function (element){
                element.content = JSON.parse(element.content.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false')); // Replace single quotes with double quotes
                //Modify every notification
                const sender_id=element.sender_id;
                let sender_name="??";
                //Get the sender's name
                await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                .then((res) => {
                    sender_name=res.user_name;
                    element.sender_name = sender_name; // Add new property to element
                });
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
        set_flash(!flash);
    }

    const markAsRead = (notification_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification/${notification_id}`, "PUT", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("标记成功");
            }
        });
        set_flash(!flash);
    }
    
    const approve_friend = (friend_id) => {
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
    const approve_chat = (chat_id) => {
        request(`${BACKEND_URL}/api/chat/${chat_id}/members`, "PUT", true,"application/json",
        {
            "user_id": store.getState().auth.id,
            "member_id": store.getState().auth.id,
            "approve": true
          })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("已加入聊天室");
            }
        });
    }
    function FriendRequestNotification({ notification, markAsRead, approve_friend, deleteNotification,index }) {
        return (
            <div key={notification.notification_id}>
                <p>index:{index+1}</p>
                <p>消息类型：好友申请</p>
                <p>sender_name: {notification.sender_name}</p>
                {notification.is_read === false && (
                    <>
                        <span>未读</span>
                        <button 
                            name="markAsRead"
                            className="btn btn-secondary"
                            onClick={() => markAsRead(notification.notification_id)}
                        >
                            标记为已读
                        </button>
                    </>
                )}
                {notification.is_read === true && (
                    <span>已读</span>
                )}
                {!store.getState().auth.friends.includes(notification.sender_id) && (
                    <button
                        name="approve_friend"
                        className="btn btn-success"
                        onClick={() => approve_friend(notification.sender_id)}
                    >
                        同意好友申请
                    </button>
                )}
                <button 
                    name="delete"
                    className="btn btn-primary"
                    onClick={() => deleteNotification(notification.notification_id)}
                >
                    删除此条通知
                </button>
            </div>
        );
    }
    function ApproveFriendNotification({ notification, markAsRead, deleteNotification,index}) {
        return (
            <div key={notification.notification_id}>
                <p>index:{index+1}</p>
                <p>消息类型：好友申请已同意</p>
                <p>sender_name: {notification.sender_name}</p>
                {notification.is_read === false && (
                    <>
                        <span>未读</span>
                        <button 
                            name="markAsRead"
                            className="btn btn-secondary"
                            onClick={() => markAsRead(notification.notification_id)}
                        >
                            标记为已读
                        </button>
                    </>
                )}
                {notification.is_read === true && (
                    <span>已读</span>
                )}
                <button 
                    name="delete"
                    className="btn btn-primary"
                    onClick={() => deleteNotification(notification.notification_id)}
                >
                    删除此条通知
                </button>
            </div>
        );
    }
    function InvitechatNotification({notification,markAsRead,approve_chat,deleteNotification,index}){
        return (
            <div key={notification.notification_id}>
                <p>index:{index+1}</p>
                <p>消息类型：聊天室邀请</p>
                <p>sender_name: {notification.sender_name}</p>
                {notification.is_read === false && (
                    <>
                        <span>未读</span>
                        <button 
                            name="markAsRead"
                            className="btn btn-secondary"
                            onClick={() => markAsRead(notification.notification_id)}
                        >
                            标记为已读
                        </button>
                    </>
                )}
                {notification.is_read === true && (
                    <span>已读</span>
                )}
                <button
                    name="approve_chat"
                    className="btn btn-success"
                    onClick={() => approve_chat(notification.chat_id)}
                >
                    同意聊天室邀请
                </button>
                <button 
                    name="delete"
                    className="btn btn-primary"
                    onClick={() => deleteNotification(notification.notification_id)}
                >
                    删除此条通知
                </button>
            </div>
        );
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
                    {notifications.map((notification,index) => {
                        switch ((notification.content.type,notification.content.status)) {
                            case ("user.friend.request","make request"):
                                return <FriendRequestNotification notification={notification} markAsRead={markAsRead} approve_friend={approve_friend} deleteNotification={deleteNotification} index={index}/>;
                            case ("user.friend.request","accept request"):
                                return <ApproveFriendNotification notification={notification} markAsRead={markAsRead} deleteNotification={deleteNotification} index={index} />;
                            case ("chat.management","make invitation"):
                                return <InvitechatNotification notification={notification} markAsRead={markAsRead} approve_chat={approve_chat} deleteNotification={deleteNotification} index={index} />;
                        }
                    })}
            </div>
        </>
    );
}

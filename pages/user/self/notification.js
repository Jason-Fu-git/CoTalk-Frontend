import React, { useState , useEffect } from "react";

import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';
import { store } from "@/app/redux/store";

export default function Notification() {
    const [notifications, set_notifications] = useState([]);
    const [flash, set_flash] = useState(false);
    
    useEffect(() => {
        const later_than=0;
        const only_unread=false;
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notifications`, "GET", true)
        .then((res) => {
            set_notifications(res.notifications);
        });
    }, [flash]);

    const deleteNotification = (notification_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification/${notification_id}/detail`, "DELETE", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("删除成功");
            }
        });
        set_flash(!flash);
    }
    const markAsRead = (notification_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification/${notification_id}/read`, "PUT", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("标记成功");
            }
        });
        set_flash(!flash);
    }
    const approve_friend = (friend_id) => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "PUT", true,
        {
            "friend_id": friend_id,
            "approve": true
          })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("好友申请已同意");
            }
        });
    }

    return (
        <>
            <button onClick={() => set_flash(!flash)}>刷新</button>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1> {notifications.length}</h1>
                        <ul>
                            {notifications.map((notification) => {
                                return (
                                    <li key={notification.notification_id}>
                                        <p>{notification.content}</p>
                                        {notification.is_read === false && (
                                            <span>未读</span>
                                        )}
                                        <button 
                                        name="delete"
                                        className="btn btn-primary"
                                        onClick={() => deleteNotification(notification.notification_id)}
                                    >
                                        删除
                                    </button>
                                    <button 
                                        name="markAsRead"
                                        className="btn btn-secondary"
                                        onClick={() => markAsRead(notification.notification_id)}
                                    >
                                        标记为已读
                                    </button>
                                    <button
                                        name="approve_friend"
                                        className="btn btn-success"
                                        onClick={() => approve_friend(notification.sender_id)}
                                    >同意好友申请</button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
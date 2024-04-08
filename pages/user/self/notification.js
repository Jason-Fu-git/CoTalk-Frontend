import React, { useState , useEffect } from "react";

import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';
import { store } from "@/app/redux/store";

export default function Notification() {
    const [notifications, set_notifications] = useState([]);
    const [flash, set_flash] = useState(false);
    
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification`, "GET", true,
        {
            "only_unread": false,
            "later_than": 0
        })
        .then((res) => {
            set_notifications(res.notifications);
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
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/notification/${notification_id}/read`, "PUT", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("标记成功");
            }
        });
        set_flash(!flash);
    }
    return (
        <>
            <button onClick={() => set_flash(!flash)}>刷新</button>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>Notification {notifications.length}</h1>
                        <ul>
                            {notifications.map((notification) => {
                                return (
                                    <li key={notification.notification_id}>
                                        <p>{notification.content}</p>
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

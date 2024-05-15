import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

import MessageCard from '@/components/MessageCard';
import {store} from "@/app/redux/store";
import {request} from "@/app/utils/network";
import {BACKEND_URL} from '@/app/constants/string';
import '@/public/style.css';

function timestampToBeijingTime(timestamp) {
    // 将时间戳转换为毫秒
    var date = new Date(timestamp * 1000);


    // 获取年、月、日、小时、分钟和秒
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);

    // 格式化时间
    var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedDate;
}

function Conversation() {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [chatname, setChatname] = useState("");
    let chatid = 0;
    let id2name = {};
    let msg2ref = {};

    if (router.query.chatid) {
        chatid = router.query.chatid;
        localStorage.setItem("chatid", chatid);
    }

    const [count, setCount] = useState(0);
    // 第一次渲染时将所有已有消息标记为已读
    const [firstRender, setFirstRender] = useState(true);
    const [toggle, setToggle] = useState(true);

    const addMessage = (newMessage) => {
        setMessages(oldMessages => {
            if (!oldMessages.some(message =>
                message.message_id === newMessage.message_id)) {
                {
                    return [...oldMessages, newMessage];
                }
            } else {
                return oldMessages;
            }
        });
        setCount(count + 1);
    };


    useEffect(() => {
        chatid = localStorage.getItem("chatid");
        if (router.query.chatid) {
            chatid = router.query.chatid;
            localStorage.setItem("chatid", chatid);
        }

        request(`${BACKEND_URL}/api/chat/${chatid}/detail`, "GET", false)
        .then((res) => {
            if (res.chat_name.includes("Private")) {
                const nums = res.chat_name.split(' ')[1].split('&');
                const friendid = nums[0] === store.getState().auth.id.toString() ? nums[1] : nums[0];
                request(`${BACKEND_URL}/api/user/private/${friendid}`, "GET", false)
                .then((res1) => {
                    setChatname("私聊 " + res1.user_name);
                });
            }else{
            setChatname("聊天室 " +" \"" +res.chat_name + "\"");
            console.log(chatname)
            }
        });

        const generalUrl = "wss://cotalkbackend-Concord.app.secoder.net/ws/main/" +
            store.getState().auth.id + "/" + store.getState().auth.token;
        const generalSocket = new WebSocket(generalUrl);

        generalSocket.onmessage = async function (event) {
            console.log("General socket receive something");
            const data = JSON.parse(event.data);
            console.log("TYPE= " + data.type + ", STATUS= " + data.status);

            if (!(data.type === "chat.message")) {
                return;
            }
            if (data.status === "send message") {
                const sender_id = data.user_id;
                const chat_id = data.chat_id;
                const message_id = data.msg_id;
                if (!chat_id === chatid) {
                    return;
                }


                let sender_name = "??";
                if (!Object.keys(id2name).includes(sender_id)) {
                    await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                        .then((res) => {
                            sender_name = res.user_name;
                            id2name[sender_id] = res.user_name;
                        });
                } else {
                    sender_name = id2name[sender_id];
                }

                const datetime = timestampToBeijingTime(data.update_time);

                const message_url = `${BACKEND_URL}/api/message/${message_id}/management?user_id=` + store.getState().auth.id;
                const message = await request(message_url, "GET", true);

                // Mark as read
                if (!message.read_users.includes(store.getState().auth.id)) {
                    await request(`${BACKEND_URL}/api/message/${message.msg_id}/management`,
                        "PUT", true, "application/json",
                        {
                            "user_id": store.getState().auth.id,
                        });
                }

                if (message.msg_type !== 'T') {
                    return;
                }
                let reply_target = message.reply_to;
                let reply_name = "??";
                let reply_message = "??";
                if (reply_target !== -1) {
                    const target_url = `${BACKEND_URL}/api/message/${reply_target}/management?user_id=` + store.getState().auth.id;
                    try {
                        const target = await request(target_url, "GET", true);

                        reply_message = target.msg_text;
                        if (!Object.keys(id2name).includes(target.sender_id)) {
                            await request(`${BACKEND_URL}/api/user/private/${target.sender_id}`, "GET", false)
                                .then((res) => {
                                    reply_name = res.user_name;
                                    id2name[sender_id] = res.user_name;
                                });
                        } else {
                            reply_name = id2name[sender_id];
                        }
                    } catch (err) {
                        reply_target = -2;
                    }
                }

                let hasread = "已读成员: ";
                for (var i = 0; i < message.read_users.length; i++) {
                    if (message.read_users[i] === store.getState().auth.id) {
                        continue;
                    }
                    let hasread_username = "??";
                    if (!Object.keys(id2name).includes(message.read_users[i])) {
                        await request(`${BACKEND_URL}/api/user/private/${message.read_users[i]}`, "GET", false)
                            .then((res) => {
                                hasread_username = res.user_name;
                                id2name[message.read_users[i]] = res.user_name;
                            });
                    } else {
                        hasread_username = id2name[message.read_users[i]];
                    }
                    hasread = hasread + " " + hasread_username + " ";
                }

                addMessage({
                    'index': count,
                    'sender_name': sender_name,
                    'sender_id': sender_id,
                    'sender_avatar': '',

                    'message': message.msg_text,
                    'message_id': message_id,

                    'datetime': datetime,

                    'onDelete': deleteMessage,
                    'onWithdrew': withdrewMessage,
                    'onReply': replyMessage,

                    'type': 'normal',

                    'reply_target': reply_target,
                    'reply_name': reply_name,
                    'reply_message': reply_message,

                    'hasread': hasread,
                });

                // Mark as read
                if (!message.read_users.includes(store.getState().auth.id)) {
                    await request(`${BACKEND_URL}/api/message/${message_id}/management`,
                        "PUT", true, "application/json",
                        {
                            "user_id": store.getState().auth.id,
                        });
                }
                setToggle(!toggle);
            } else if (data.status === "withdraw message") {
                console.log("Forced to load all messages");
                const messages_url = `${BACKEND_URL}/api/chat/${chatid}/messages?user_id=` + store.getState().auth.id;

                request(messages_url, "GET", true)
                    .then(async (res) => {
                        const promises = res.messages.map(async function (element, index) {
                            const sender_id = element.sender_id;

                            let sender_name = "??";
                            if (!Object.keys(id2name).includes(sender_id)) {
                                await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                                    .then((res) => {
                                        sender_name = res.user_name;
                                        id2name[sender_id] = res.user_name;
                                    });
                            } else {
                                sender_name = id2name[sender_id];
                            }


                            const datetime = timestampToBeijingTime(element.create_time);

                            // Mark as read
                            if (!element.read_users.includes(store.getState().auth.id)) {
                                await request(`${BACKEND_URL}/api/message/${element.msg_id}/management`,
                                    "PUT", true, "application/json",
                                    {
                                        "user_id": store.getState().auth.id,
                                    });
                            }

                            let reply_target = element.reply_to;
                            let reply_name = "??";
                            let reply_message = "??";
                            if (reply_target !== -1) {
                                const target_url = `${BACKEND_URL}/api/message/${reply_target}/management?user_id=` + store.getState().auth.id;
                                try {
                                    const target = await request(target_url, "GET", true);

                                    reply_message = target.msg_text;

                                    if (!Object.keys(id2uaer).includes(target.sender_id)) {
                                        await request(`${BACKEND_URL}/api/user/private/${target.sender_id}`, "GET", false)
                                            .then((res) => {
                                                target_name = res.user_name;
                                                id2user[target.sender_id] = res.user_name;
                                            });
                                    }
                                } catch (err) {
                                    reply_target = -2;
                                }
                            }

                            const type = (sender_name === 'system') ? 'system' : 'normal';

                            let hasread = "已读成员: ";
                            for (var i = 0; i < element.read_users.length; i++) {
                                if (element.read_users[i] === store.getState().auth.id) {
                                    continue;
                                }
                                let hasread_username = "??"
                                if (!Object.keys(id2name).includes(element.read_users[i])) {
                                    await request(`${BACKEND_URL}/api/user/private/${element.read_users[i]}`, "GET", false)
                                        .then((res) => {
                                            hasread_username = res.user_name;
                                            id2name[element.read_users[i]] = res.user_name;
                                        });
                                } else {
                                    hasread_username = id2name[element.read_users[i]];
                                }
                                hasread = hasread + " " + hasread_username + " ";
                            }
                            return ({
                                'index': index,
                                'sender_name': sender_name,
                                'sender_id': sender_id,
                                'sender_avatar': '',

                                'message': element.msg_text,
                                'message_id': element.msg_id,

                                'datetime': datetime,

                                'onDelete': deleteMessage,
                                'onWithdrew': withdrewMessage,
                                'onReply': replyMessage,

                                'type': type,
                                'msg_type': element.msg_type,

                                'reply_target': reply_target,
                                'reply_name': reply_name,
                                'reply_message': reply_message,

                                'hasread': hasread,
                            });
                        });
                        const history = await Promise.all(promises);
                        const history2 = history.filter(obj => obj.msg_type !== 'G');
                        setMessages(history2);
                        setCount(history2.length);
                        console.log("History restored");
                        console.log(history2);
                        setToggle(!toggle);
                    });
            }
        }

        generalSocket.onclose = function (event) {
            console.log('General socket closed');
        };

        generalSocket.onopen = function (event) {
            console.log("Open general websocket");
        };

        if (firstRender) {
            console.log("Loading history for user " + store.getState().auth.id);
            const messages_url = `${BACKEND_URL}/api/chat/${chatid}/messages?user_id=` + store.getState().auth.id;

            request(messages_url, "GET", true)
                .then(async (res) => {
                    const promises = res.messages.map(async function (element, index) {
                        const sender_id = element.sender_id;

                        let sender_name = "??";
                        if (!Object.keys(id2name).includes(sender_id)) {
                            await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                                .then((res) => {
                                    sender_name = res.user_name;
                                    id2name[sender_id] = res.user_name;
                                });
                        } else {
                            sender_name = id2name[sender_id];
                        }

                        const datetime = timestampToBeijingTime(element.create_time);
                        // Mark as read
                        if (!element.read_users.includes(store.getState().auth.id)) {
                            await request(`${BACKEND_URL}/api/message/${element.msg_id}/management`,
                                "PUT", true, "application/json",
                                {
                                    "user_id": store.getState().auth.id,
                                });
                        }

                        let reply_target = element.reply_to;
                        let reply_name = "??";
                        let reply_message = "??";
                        if (reply_target !== -1) {
                            const target_url = `${BACKEND_URL}/api/message/${reply_target}/management?user_id=` + store.getState().auth.id;
                            try {
                                const target = await request(target_url, "GET", true);

                                reply_message = target.msg_text;

                                if (!Object.keys(id2name).includes(target.sender_id)) {
                                    await request(`${BACKEND_URL}/api/user/private/${target.sender_id}`, "GET", false)
                                        .then((res) => {
                                            reply_name = res.user_name;
                                            id2name[target.sender_id] = res.user_name;
                                        });
                                } else {
                                    reply_name = id2name[target.sender_id];
                                }
                            } catch (err) {
                                reply_target = -2;
                            }
                        }

                        const type = (element.is_system) ? 'system' : 'normal';

                        let hasread = "已读成员: ";
                        for (var i = 0; i < element.read_users.length; i++) {
                            if (element.read_users[i] === store.getState().auth.id) {
                                continue;
                            }
                            let hasread_username = "??"
                            if (!Object.keys(id2name).includes(element.read_users[i])) {
                                await request(`${BACKEND_URL}/api/user/private/${element.read_users[i]}`, "GET", false)
                                    .then((res) => {
                                        hasread_username = res.user_name;
                                        id2name[element.read_users[i]] = res.user_name;
                                    });
                            } else {
                                hasread_username = id2name[element.read_users[i]];
                            }
                            hasread = hasread + " " + hasread_username + " ";
                        }

                        return ({
                            'index': index,
                            'sender_name': sender_name,
                            'sender_id': sender_id,
                            'sender_avatar': '',

                            'message': element.msg_text,
                            'message_id': element.msg_id,

                            'datetime': datetime,

                            'onDelete': deleteMessage,
                            'onWithdrew': withdrewMessage,
                            'onReply': replyMessage,

                            'type': type,
                            'msg_type': element.msg_type,

                            'reply_target': reply_target,
                            'reply_name': reply_name,
                            'reply_message': reply_message,

                            'hasread': hasread,
                        });
                    });
                    const history = await Promise.all(promises);
                    const history2 = history.filter(obj => obj.msg_type !== 'G');
                    setMessages(history2);
                    setCount(history2.length);
                    console.log("History restored");
                    console.log(history2);
                });
            setFirstRender(false);
        }

        return () => {
            generalSocket.close();
        }
    }, [toggle]);

    const sendMessage = function (event) {
        let inputArea = document.getElementById('chat-message-input');
        const message = inputArea.value;
        if (message) {
            // 通过Http发送一份
            console.log("Send Http");
            request(`${BACKEND_URL}/api/message/send`, "POST", true, "application/json",
                {
                    "user_id": store.getState().auth.id,
                    "chat_id": chatid,
                    "msg_text": message,
                    "msg_type": "text",
                })
                .catch((err) => {
                    alert("发送失败");
                    console.log(err);
                });

            inputArea.value = '';
            inputArea.focus();
        } else {
            inputArea.value = '';
            inputArea.focus();
        }
    }

    const deleteMessage = function (message_id) {
        console.log("delete function called.");
        console.log("message id: " + message_id);

        request(`${BACKEND_URL}/api/message/${message_id}/management`,
            "DELETE", true, "application/json",
            {
                "user_id": store.getState().auth.id,
                "is_remove": false,
            })
            .then((res) => {
                alert("成功删除");
                setMessages((currentMessages) => {
                    const newMessages = currentMessages.filter(obj => (obj.message_id !== message_id));
                    newMessages.forEach(function (element) {
                        if (element.reply_target === message_id) {
                            element.reply_target = -2;
                        }
                    })
                    return newMessages;
                });
            })
            .catch((err) => {
                alert("删除失败");
                console.log(err);
            })
    }

    const withdrewMessage = function (message_id) {
        console.log("Withdrew function called.");
        console.log("message id: " + message_id);

        request(`${BACKEND_URL}/api/message/${message_id}/management`,
            "DELETE", true, "application/json",
            {
                "user_id": store.getState().auth.id,
                "is_remove": true,
            })
            .then((res) => {
                alert("成功撤回");
            })
            .catch((err) => {
                alert("无法撤回");
                console.log(err);
            });
    }

    const replyMessage = function (message_id, message) {
        // 通过Http发送一份
        console.log("Reply: " + message);
        console.log("Send Http");
        request(`${BACKEND_URL}/api/message/send`, "POST", true, "application/json",
            {
                "user_id": store.getState().auth.id,
                "chat_id": chatid,
                "msg_text": message,
                "msg_type": "text",
                "reply_to": message_id,
            })
            .then((res) => {
                alert("回复成功");
            })
            .catch((err) => {
                alert("回复失败");
                console.log(err);
            });
    }

    const prepareCards = function () {
        messages.forEach(function (message) {
            if (!Object.keys(msg2ref).includes(message.message_id)) {
                let componentRef = React.createRef();
                msg2ref[message.message_id] = componentRef;
            }
        });

        return messages.map((message) => {
            if (message.reply_target >= 0) {
                console.log("SET JUMP TARGET FOR " + message.message_id);
                console.log(msg2ref[message.reply_target]);
                return (
                    <div key={message.message_id}>
                        <MessageCard {...message}
                                     ref={msg2ref[message.message_id]}
                                     reply_ref={msg2ref[message.reply_target]}/>
                    </div>);
            } else {
                return (
                    <div key={message.message_id}>
                        <MessageCard {...message}
                                     ref={msg2ref[message.message_id]}
                                     reply_ref={null}/>
                    </div>);
            }
        });
    }

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16" style={{textAlign: "center"}}>
                <h1 className="
                    dark:text-white text-4xl font-bold text-center" style={{margin: "20px"}}>
                     {chatname}
                </h1>
                {(!chatname.includes("私聊"))&&(<Link href={`/chat/${chatid}`} style={{marginRight: "20px"}} passHref>
                    群聊信息
                </Link>)}
                <Link href={`/chat/${chatid}/search_history`} passHref>
                    搜索聊天记录
                </Link>

                <div style={{marginTop: "20px"}}></div>

                {
                    prepareCards()
                }

                <div className="input-group mb-3 fixed-input">
                    <input
                        className="form-control col_auto"
                        type="text"
                        placeholder="请输入聊天内容"
                        id="chat-message-input"
                    />
                    <div className="col-auto">
                        <button
                            name="submit"
                            className="btn btn-primary"
                            onClick={sendMessage}
                        >
                            发送
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Conversation;
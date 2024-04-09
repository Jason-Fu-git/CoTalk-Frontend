import React,{useState, useEffect}  from "react";
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";

export default function Createpage(){
    const [chatName, setChatName] = useState("");
    const [memberid, setMemberid] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const selfid = store.getState().auth.id;

    useEffect(() => {
        request(`${BACKEND_URL}/api/user/${selfid}/friends`, "GET", true)
        .then((res) => {
            setFriends(res.friends);
        });
    }, []);

    const createChat = () => {
        request(`${BACKEND_URL}/api/chat/create`, "POST", true,{
            "use_id": selfid,
            "chat_name": chatName,
            "members": memberid
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("创建成功");
            }
        });
    }

    return (
        <div>
            <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="请输入聊天室名称"
            />
            <button onClick={() => setShowModal(true)}>选择好友</button>
            {showModal && (
                <div>
                    {friends.map((friend) => (
                        <div key={friend.id}>
                            {friend.name}
                            <button onClick={() => setMemberid([...memberid, friend.id])}>添加</button>
                        </div>
                    ))}
                    <button onClick={() => setShowModal(false)}>关闭</button>
                </div>
            )}
            <button onClick={createChat}>创建聊天室</button>
        </div>
    )
}
import React,{useState, useEffect}  from "react";
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";
import { useRouter } from "next/router";

export default function Createpage(){
    const [chatName, setChatName] = useState("");
    const [memberid, setMemberid] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const selfid = store.getState().auth.id;
    const router = useRouter();
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${selfid}/friends`, "GET", true)
        .then((res) => {
            setFriends(res.friends);
        });
    }, []);

    const createChat = () => {
        request(`${BACKEND_URL}/api/chat/create`, "POST", true,"application/json",{
            "user_id": selfid,
            "chat_name": chatName,
            "members": memberid
        })
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("创建成功");
                router.push(`/chat/${res.chat_id}/conversation`);
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
                        <div key={friend.user_id}>
                            {friend.user_name}
                            <input 
                                type="checkbox" 
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setMemberid([...memberid, friend.user_id]);
                                    } else {
                                        setMemberid(memberid.filter(id => id !== friend.user_id));
                                    }
                                }}
                            />
                        </div>
                    ))}
                    <button onClick={() => setShowModal(false)}>关闭</button>
                </div>
            )}

            <button 
            disabled={chatName===''||memberid.length===0}
            onClick={createChat}>创建聊天室</button>
        </div>
    )
}
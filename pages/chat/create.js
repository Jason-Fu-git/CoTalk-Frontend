import 'bootstrap/dist/css/bootstrap.css';
import React,{useState, useEffect}  from "react";
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";
import { useRouter } from "next/router";

export default function Createpage(){
    const [chatName, setChatName] = useState("");
    const [memberid, setMemberid] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const selfid = store.getState().auth.id;
    const router = useRouter();
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${selfid}/friends`, "GET", true)
        .then((res) => {
            setFriends(res.friends);
            console.log("Froends: "+res.friends);
            setShowModel(true);
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
        <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
            <h1 className="
                dark:text-white text-4xl font-bold text-center">
                请选择好友来创建群聊
            </h1>
            {showModel && (
                <div>
                    {friends.map((friend) => (
                        <div class="form-check">
                        <input 
                            type="checkbox" 
                            class="btn-check" 
                            id="btn-check-outlined" 
                            autocomplete="off"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setMemberid([...memberid, friend.user_id]);
                                } else {
                                    setMemberid(memberid.filter(id => id !== friend.user_id));
                                }
                            }}/>
                        <label class="btn btn-outline-primary" for="btn-check-outlined">
                        {friend.user_name}
                        </label>
                        </div>
                    ))}
                </div>
            )}

            <div className="input-group mb-3">
                <input
                    className="form-control col_auto"
                    type="text"
                    placeholder="请输入聊天室名称"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                />
                <div className="col-auto">
                    <button 
                        className="btn btn-primary"
                        disabled={chatName===''||memberid.length===0}
                        onClick={createChat}>
                        创建聊天室
                    </button>
                </div>
            </div>
        </div>
    )
}
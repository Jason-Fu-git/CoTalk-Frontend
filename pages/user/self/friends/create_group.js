import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from "react";
import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";
import UserCard from '@/components/UserCard';
import {useRouter} from "next/router";

export default function Createpage() {
    const [groupName, setGroupName] = useState("");
    const [memberid, setMemberid] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const selfid = store.getState().auth.id;
    const router = useRouter();
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/private/${selfid}/friends`, "GET", true)
            .then((res) => {
                setFriends(res.friends);
                setShowModel(true);
            });
    }, []);

    const createChat = async () => {
        const promises = memberid.map(id =>
            request(`${BACKEND_URL}/api/user/private/${selfid}/friends`, "PUT", true, "application/json", {
                "friend_id": id,
                "group": groupName
            })
        );
        await Promise.all(promises);
        router.push("/user/self/friends");
    }

    return (
        <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
            <h1 className="
                dark:text-white text-4xl font-bold text-center">
                创建分组
            </h1>


            <div className="input-group mb-3" style={{margin:"40px"}}>
                <input
                    className="form-control col_auto"
                    type="text"
                    placeholder="请输入分组名称"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="col-auto">
                    <button
                        className="btn btn-primary"
                        disabled={groupName === '' || memberid.length === 0}
                        onClick={createChat}>
                        创建分组
                    </button>
                </div>
            </div>

            {showModel && (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {friends.map((friend, index) => (

                        <div key={index}>
                            <div>
                                <input
                                    type="checkbox"
                                    className="btn-check"
                                    autoComplete="off"
                                    id={friend.user_id}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setMemberid([...memberid, friend.user_id]);
                                        } else {
                                            setMemberid(memberid.filter(id => id !== friend.user_id));
                                        }
                                    }}/>
                                <label
                                    className="btn btn-outline-primary"
                                    htmlFor={friend.user_id}>
                                     选择
                                </label>
                            </div>
                            <div key={friend.user_id}>
                                <UserCard {...friend}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>


    )
}
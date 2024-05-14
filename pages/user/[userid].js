import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React, {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css';

import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";
import {setFriends} from "@/app/redux/auth";
import default_background from "@/public/DefaultBackground.jpg"

function Account() {
    const router = useRouter();
    const [id, setId] = useState(-1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState('');
    const [is_friend, setIsFriend] = useState(false);
    let userid;
    if (router.query.userid) {
        userid = router.query.userid;
        localStorage.setItem("userid", userid);
    }
    useEffect(() => {
        userid = localStorage.getItem("userid");
        if (router.query.userid) {
            userid = router.query.userid;
            localStorage.setItem("userid", userid);
        }
        setId(userid);
        console.log(userid);
        const my_friends = store.getState().auth.friends;
        setIsFriend(my_friends.includes(Number(userid)));
        console.log(is_friend);
        request(`${BACKEND_URL}/api/user/private/${userid}`, "GET", false)
            .then((res) => {
                setName(res.user_name);
                setEmail((res.user_email === "") ? "邮箱为空" : res.user_email);
                setPhone((res.user_phone === "") ? "手机号为空" : res.user_phone);
                setDescription((res.description === "") ? "目前还没有个人描述" : res.description);
            });
        request(`${BACKEND_URL}/api/user/private/${userid}/avatar`, "GET", false)
            .then((url) => {
                setAvatar(url);
            });
    }, []);


    const apply_friend = () => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "PUT", true, "application/json",
            {
                "friend_id": id,
            })
            .then((res) => {
                if (Number(res.code) === 0) {
                    alert("好友申请已发送");
                }
            })
    };

    const delete_friend = () => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/friends`, "PUT", true, "application/json",
            {
                "friend_id": id,
                "approve": false,
            })
            .then((res) => {
                if (Number(res.code) === 0) {
                    store.dispatch(setFriends(store.getState().auth.friends.filter((friend_id) => friend_id !== id)));
                    alert("已删除好友");
                    router.push("/user/self/friends");
                }
            })
    };

    return (
        <div className="pt-0 sm:pt-16">
            <div className="dark:bg-gray-800 text-white w-12/12 shadow-lg sm:w-9/12 sm:m-auto">
                <div className="relative sm:w-full">
                    <Image
                        src={default_background}
                        alt={name}
                        className="w-full h-96 object-cover object-center"
                    />
                    <div
                        className="bg-gray-800 bg-opacity-50 absolute flex items-end	w-full h-full top-0 left-0 p-8">
                        <Image
                            src={avatar.url}
                            alt={name}
                            width={avatar.width}
                            height={avatar.height}
                            className="bg-gray-300 w-20 rounded-full mr-4"
                        />
                        <div>
                            <h1 className="font-bold text-3xl">
                                {name}的个人主页
                            </h1>
                            <p style={{marginTop:"20px"}}>{email}</p>
                            <p>{phone}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <p className="text-black dark:text-white">
                        {description}
                    </p>
                    {(is_friend) ?
                        (<button
                            className="dark:bg-blue-400
						dark:text-gray-800
						bg-blue-400
						text-white
						font-semibold
						p-2
						rounded-md
						mt-6"
                            onClick={delete_friend}>
                            解除好友关系
                        </button>) :
                        (<button
                            className="dark:bg-blue-400
						dark:text-gray-800
						bg-blue-400
						text-white
						font-semibold
						p-2
						rounded-md
						mt-6"
                            onClick={apply_friend}>
                            申请成为好友
                        </button>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Account;
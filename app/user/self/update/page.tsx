'use client'
import { useState } from "react";
import { BACKEND_URL, UPDATE_SUCCESS, UPDATE_FAILED} from "../../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setEmail, setDescription } from "../../../redux/auth";
import {store} from "@/app/redux/store";
import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';
import {request} from '@/app/utils/network'

const Update = () => {
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [user_email, setEmail] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();
    const dispatch = store.dispatch;

    const update = () => {
        request(`${BACKEND_URL}/api/user/`, "PUT", true, 
            {
                "user_name": user_name,
                "password": password,
                "user_email": user_email,
                "description": description,
            })
        .then((res) => {
            if (Number(res.code) === 0) {
                dispatch(setName(res.user_name));
                dispatch(setEmail(res.user_email));
                dispatch(setDescription(res.description));

                alert(UPDATE_SUCCESS);
                router.push(`/user/self`);
            }
            else {
                alert(UPDATE_FAILED);
            }
        })
    };

    return (
        <>
            <p className="lead">修改个人信息</p>
            <div className="input-group mb-3">
            <p>用户名</p>
            <input
                className="form-control"
                type="text"
                placeholder={user_name}
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
            />
            </div>

            <div className="input-group mb-3">
            <p>邮箱</p>
            <input
                className="form-control"
                type="password"
                placeholder={user_email}
                value={user_email}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <div className="input-group mb-3">
            <p>个人描述</p>
            <input
                className="form-control"
                type="password"
                placeholder={(description==="")? "目前还没有个人描述" : description}
                value={description}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button 
                name="submit"
                className="btn btn-primary"
                onClick={update} 
                disabled={user_name === "" || password === ""}>
                确认修改
            </button>
        </>
    );
};

export default Update;

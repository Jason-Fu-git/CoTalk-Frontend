'use client'
import { useState, useEffect, use } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from "next/navigation";

import { BACKEND_URL, UPDATE_SUCCESS,DELETE_SUCCESS} from "@/app/constants/string";
import { setName, setEmail, setDescription} from "@/app/redux/auth";
import { resetAuth } from "@/app/redux/auth";
import {store} from "@/app/redux/store";
import {request} from '@/app/utils/network'

const Update = () => {
    const [user_name, set_userName] = useState("");
    const [user_email, set_email] = useState("");
    const [password,setPassword]=useState("");
    const [description, set_description] = useState("");
    const [avatar, setAvatar] = useState(typeof window !== 'undefined' ? new File([], "") : null);
    const [prev_name, setPrevName] = useState("");
    const [prev_email, setPrevEmail] = useState("");
    const [code, setCode] = useState("");
    const [prev_description, setPrevDescription] = useState("");
    const [disabled,setDisabled] = useState(true);
    const router = useRouter();
    const dispatch = store.dispatch;

    useEffect(() => {
        setPrevName(store.getState().auth.name);
        setPrevEmail(store.getState().auth.email);
        setPrevDescription(store.getState().auth.description);
    }, []);
        useEffect(() => {
            let isDisabled = user_name === "" && description === "" && user_email === "" && avatar !== null && avatar.size === 0 && password === "";
            if(code!==""&&password===""){
                isDisabled=true;
            }
            setDisabled(isDisabled);
        }, [user_name, description, user_email, avatar, password]);
        const update = () => {
        const formData = new FormData();
        if(user_name!==""){
            formData.append("user_name", user_name);
        }
        if(user_email!==""){
            formData.append("user_email", user_email);
        }
        if(description!==""){
            formData.append("description", description);
        }
        if(password!==""){
            formData.append("password", password);

        }
        if (avatar!=null&&avatar.size !== 0) {
            formData.append("avatar", avatar);
        }
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}`, "POST", true, "multipart/form-data", formData)
        .then((res) => {
            if (Number(res.code) === 0) {
                if(user_name!==""){
                    dispatch(setName(user_name));
                }
                if(user_email!==""){
                    dispatch(setEmail(user_email));
                }
                if(description!==""){
                    dispatch(setDescription(description));
                }
                alert(UPDATE_SUCCESS);
                router.push(`/user/self`);
            }
        })
    };

    const sendcode = () => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/verification`, "PUT", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("验证码已发送，请查看邮箱");
            }
        });
    }
    return (
        <>
            <p className="lead">修改个人信息</p>
            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">用户名</label>
            <input
                className="form-control"
                type="text"
                placeholder={prev_name}
                value={user_name}
                onChange={(e) => set_userName(e.target.value)}
            />
            </div>

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">邮箱</label>
            <input
                className="form-control"
                type="text"
                placeholder={prev_email}
                value={user_email}
                onChange={(e) => set_email(e.target.value)}
            />
            </div>
            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">头像</label>
            <input
                className="form-control"
                type="file"
                onChange={(e) => setAvatar(e.target.files?.[0] as File)}
            />
            </div>
            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">个人描述</label>
            <input
                className="form-control"
                type="text"
                placeholder={prev_description}
                value={description}
                onChange={(e) => set_description(e.target.value)}
            />
            </div>
            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">新密码</label>
            <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">6位验证码</label>
            <input
                className="form-control"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            </div>
            <button 
                name="code"
                className="btn btn-secondary"
                onClick={sendcode}>
                发送验证码
            </button>
            <button 
                name="submit"
                className="btn btn-primary"
                onClick={update} 
                disabled={disabled}>
                确认修改
            </button>
        </>
    );
};

export default Update;

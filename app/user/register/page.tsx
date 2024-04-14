'use client'
import React, { useState } from 'react';
import { BACKEND_URL, REGISTER_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setId, setToken,setEmail,setDescription} from "../../redux/auth";
import {store} from "@/app/redux/store";
import 'bootstrap/dist/css/bootstrap.css'
import {request} from '@/app/utils/network'
const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [avatar, setAvatar] = useState(typeof window !== 'undefined' ? new File([], "") : null);
    const [description, setdescription] = useState('');
    const router = useRouter();
    // const dispatch = store.dispatch;
    
    const register = async() => {
        const formData = new FormData();
        formData.append("user_name", username);
        formData.append("password", password);
        formData.append("user_email", email);
        formData.append("description", description);
        if (avatar!=null&&avatar.size !== 0) {
            formData.append("avatar", avatar);
        }
        
        request(`${BACKEND_URL}/api/user/register`, "POST", false, "multipart/form-data", formData)
        .then((res) => {
            if (Number(res.code) === 0) {
                // dispatch(setName(res.user_name));
                // dispatch(setToken(res.token));
                // dispatch(setId(res.user_id));
                // dispatch(setEmail(res.user_email));
                // dispatch(setDescription(res.description));
                //alert(REGISTER_SUCCESS_PREFIX + res.user_name);
                router.push(`/user/login`);
            }
        })
        
    };

    return (
        <>
            <p className="lead">注册</p>
            <div className="input-group mb-3">
            <input
                className="form-control"
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="input-group mb-3">           
            <input
                className="form-control"
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div className="input-group mb-3">           
            <input
                className="form-control"
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setemail(e.target.value)}
            />
            </div>
            <div className="input-group mb-3">
            <input
                className="form-control"
                type="file"
                onChange={(e) => setAvatar(e.target.files?.[0] as File)}
            />
            </div>
            <div className="input-group mb-3">
            <textarea
                className="form-control"
                placeholder="个人简介"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
            />
            </div>
            <button 
                name="submit" 
                className="btn btn-primary"
                onClick={register} 
                disabled={username === "" || password === ""}>
                提交
            </button>
        </>
    );
  };

  export default RegisterPage;

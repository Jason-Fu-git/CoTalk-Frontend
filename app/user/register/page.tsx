'use client'
import React, { useState } from 'react';
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setId,setToken } from "../../redux/auth";
import store from "@/app/redux/store";
import 'bootstrap/dist/css/bootstrap.css'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const router = useRouter();
    const dispatch = store.dispatch;
    
    const register = () => {
        request(`${BACKEND_URL}/api/user/register`, "POST", false, {"user_name": username, "password": password})
        .then((res) => {
            if (Number(res.code) === 0) {
                dispatch(setName(res.user_name));
                alert(store.getState().auth.name);
                dispatch(setToken(res.token));
                dispatch(setId(res.user_id));
                alert(store.getState().auth.id);
                alert(LOGIN_SUCCESS_PREFIX + res.user_name);
                router.push(`/user/${res.user_id}`);
            }
            else {
                alert(LOGIN_FAILED);
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
                onChange={(e) => setEmail(e.target.value)}
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
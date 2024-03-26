'use client'
import React, { useState } from 'react';
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setToken } from "../../redux/auth";
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
      fetch(`${BACKEND_URL}/api/user/register`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                email,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(username));
                    dispatch(setToken(res.token));
                    alert(LOGIN_SUCCESS_PREFIX + username);

                    /**
                     * @note 这里假定 login 页面不是首页面，大作业中这样写的话需要作分支判断
                     */
                    router.back();
                }
                else {
                    alert(LOGIN_FAILED);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <>
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
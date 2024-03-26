'use client'
import React, { useState } from 'react';
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setId,setToken } from "../../redux/auth";
import store from "@/app/redux/store";
import { NetworkError, request } from "../../utils/network";

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
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={register} disabled={username === "" || password === ""}>
                Login
            </button>
        </>
    );
  };

  export default RegisterPage;
'use client'
import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setId,setToken } from "../../redux/auth";
import store from "@/app/redux/store";
import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';

const LoginScreen = () => {
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const dispatch = store.dispatch;

    const login = () => {
        request(`${BACKEND_URL}/api/user/login`, "POST", false, {"user_name": user_name, "password": password})
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
            <p className="lead">请登录</p>
            <div className="input-group mb-3">
            <input
                className="form-control"
                type="text"
                placeholder="用户名"
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
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
            <button 
                name="submit"
                className="btn btn-primary"
                onClick={login} 
                disabled={user_name === "" || password === ""}>
                Login
            </button>
            <p></p>
            <p>没有账户?
                <Link href="/user/register">注册</Link> 
            </p>
        </>
    );
};

export default LoginScreen;

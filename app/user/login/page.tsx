'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';

import {BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX} from "../../constants/string";
import {setName, setId, setToken, resetAuth, setDescription, setEmail, setPhone} from "../../redux/auth";
import {store} from "@/app/redux/store";
import {request} from '@/app/utils/network'

const LoginScreen = () => {
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const dispatch = store.dispatch;

    const login = () => {
        request(`${BACKEND_URL}/api/user/login`, "POST", false, "application/json", {
            "user_name": user_name,
            "password": password
        })
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(res.user_name));
                    dispatch(setToken(res.token));
                    dispatch(setId(res.user_id));
                    dispatch(setEmail(res.user_email));
                    dispatch(setDescription(res.description));
                    dispatch(setPhone(res.user_phone))
                    //alert(LOGIN_SUCCESS_PREFIX + res.user_name);
                    router.push(`/user/self`);
                }
            })
            .catch((err) => {
                alert(err);
            })
    };
    dispatch(resetAuth());
    return (
        <>
            <p className="lead">登录</p>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>*用户名</span>
                <input
                    id="name-input"
                    className="form-control"
                    type="text"
                    placeholder="用户名"
                    value={user_name}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>*密码</span>
                <input
                    id="password-input"
                    className="form-control"
                    type="password"
                    placeholder="密码"
                    value={password}
                    aria-describedby="passwordHelpBlock"
                    onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button
                name="submit"
                className="btn btn-primary"
                onClick={login}
                disabled={user_name === "" || password === ""}>
                登录
            </button>
            <p></p>
            <p>没有账户?
                <Link href="/user/register">注册</Link>
            </p>
        </>
    );
};

export default LoginScreen;

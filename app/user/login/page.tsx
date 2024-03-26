'use client'
import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setToken } from "../../redux/auth";
import store from "@/app/redux/store";
import 'bootstrap/dist/css/bootstrap.css'


const LoginScreen = () => {
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const dispatch = store.dispatch;

    const login = () => {
        fetch(`${BACKEND_URL}/api/user/login`, {
            method: "POST",
            body: JSON.stringify({
                user_name,
                password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(user_name));
                    dispatch(setToken(res.token));
                    alert(LOGIN_SUCCESS_PREFIX + user_name);

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
        </>
    );
};

export default LoginScreen;

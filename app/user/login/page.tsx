'use client'
import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../../constants/string";
import { useRouter } from "next/navigation";
import { setName, setId,setToken } from "../../redux/auth";
import store from "@/app/redux/store";
import { request } from "../../utils/network";


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
            <input
                type="text"
                placeholder="username"
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login} disabled={user_name === "" || password === ""}>
                Login
            </button>
        </>
    );
};

export default LoginScreen;

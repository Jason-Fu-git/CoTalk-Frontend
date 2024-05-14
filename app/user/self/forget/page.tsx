'use client'
import {useState, useEffect, use} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {useRouter} from "next/navigation";

import {BACKEND_URL, UPDATE_SUCCESS, DELETE_SUCCESS} from "@/app/constants/string";
import {resetAuth} from "@/app/redux/auth";
import {store} from "@/app/redux/store";
import {request} from '@/app/utils/network'

const Update = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [code, setCode] = useState("");
    const router = useRouter();
    const [disabled, setDisabled] = useState(true);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        let isDisabled = true;
        if (code !== "" && password !== "" && confirmPassword !== "") {
            isDisabled = false;
        }
        setDisabled(isDisabled);
    }, [code, password, confirmPassword]);

    const update = () => {
        const formData = new FormData();

        if (password !== confirmPassword) {
            alert("密码不一致!")
        } else {
            formData.append("password", password);
            formData.append("code", code);
            request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}`, "POST", true, "multipart/form-data", formData)
                .then((res) => {
                    alert(UPDATE_SUCCESS);
                    router.push(`/user/self`);
                })
        }
    }

    const sendcode = () => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/verification`, "PUT", true)
            .then((res) => {
                if (Number(res.code) === 0) {
                    alert("验证码已发送，请查看邮箱");
                    setSent(true);
                }
            });
    }


    return (
        <>
            <p className="lead">忘记密码</p>

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
                <label htmlFor="exampleFormControlInput1" className="form-label">确认密码</label>
                <input
                    className="form-control"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

            {
                !sent &&
                <button
                    name="code"
                    className="btn btn-secondary"
                    onClick={sendcode}
                    disabled={sent}>
                    发送验证码
                </button>
            }

            {
                sent &&
                <button
                    name="code"
                    className="btn btn-secondary"
                    onClick={sendcode}
                    disabled={true}>
                    已发送，如欲再次发送请刷新页面
                </button>
            }

            <button
                name="submit"
                className="btn btn-primary"
                onClick={update}
                disabled={disabled}
                style={{marginLeft: "20px"}}>
                确认修改
            </button>
        </>
    );
};

export default Update;
'use client'
import {useState, useEffect, use} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {useRouter} from "next/navigation";

import {BACKEND_URL, UPDATE_SUCCESS, DELETE_SUCCESS} from "@/app/constants/string";
import {setName, setEmail, setDescription, setPhone} from "@/app/redux/auth";
import {resetAuth} from "@/app/redux/auth";
import {store} from "@/app/redux/store";
import {request} from '@/app/utils/network'
import Link from "next/link";

const Update = () => {
    const [old_pwd, set_old_pwd] = useState("");
    const [user_name, set_userName] = useState("");
    const [user_email, set_email] = useState("");
    const [user_phone, set_phone] = useState("");
    const [description, set_description] = useState("");
    const [avatar, setAvatar] = useState(typeof window !== 'undefined' ? new File([], "") : null);
    const [prev_name, setPrevName] = useState("");
    const [prev_email, setPrevEmail] = useState("");
    const [prev_phone, setPrevPhone] = useState("");
    const [prev_description, setPrevDescription] = useState("");
    const [disabled, setDisabled] = useState(true);
    const router = useRouter();
    const dispatch = store.dispatch;

    useEffect(() => {
        setPrevName(store.getState().auth.name);
        setPrevEmail(store.getState().auth.email);
        setPrevDescription(store.getState().auth.description);
        setPrevPhone(store.getState().auth.phone)
    }, []);

    useEffect(() => {
        let isDisabled = user_name === "" && description === "" && user_email === "" && avatar !== null && avatar.size === 0 && user_phone === "";
        setDisabled(isDisabled);
        if (old_pwd === "") {
            isDisabled = true;
        }
    }, [user_phone, user_name, description, user_email, avatar, old_pwd]);
    const update = () => {
        const formData = new FormData();

        if (old_pwd !== "") {
            formData.append("old_password", old_pwd);
        }
        if (user_name !== "") {
            formData.append("user_name", user_name);
        }
        if (user_email !== "") {
            formData.append("user_email", user_email);
        }
        if (user_phone !== "") {
            formData.append("user_phone", user_phone);
        }
        if (description !== "") {
            formData.append("description", description);
        }
        if (avatar != null && avatar.size !== 0) {
            formData.append("avatar", avatar);
        }
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}`, "POST", true, "multipart/form-data", formData)
            .then((res) => {
                if (Number(res.code) === 0) {
                    if (user_name !== "") {
                        dispatch(setName(user_name));
                    }
                    if (user_email !== "") {
                        dispatch(setEmail(user_email));
                    }
                    if (description !== "") {
                        dispatch(setDescription(description));
                    }
                    if (user_phone !== "") {
                        dispatch(setPhone(user_phone));
                    }
                    alert(UPDATE_SUCCESS);
                    router.push(`/user/self`);
                }
            })
    };

    return (
        <>
            <p className="lead">修改个人信息</p>
            <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">*原密码</label>
                <input
                    className="form-control"
                    type="password"
                    value={old_pwd}
                    onChange={(e) => set_old_pwd(e.target.value)}
                />
            </div>

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
                <label htmlFor="exampleFormControlInput1" className="form-label">电话</label>
                <input
                    className="form-control"
                    type="text"
                    placeholder={prev_phone}
                    value={user_phone}
                    onChange={(e) => set_phone(e.target.value)}
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
            <button
                name="submit"
                className="btn btn-primary"
                onClick={update}
                disabled={disabled}>
                确认修改
            </button>
            <Link href={"/user/self/forget"} style={{margin: "20px"}} passHref>
                <span>忘记密码？</span>
            </Link>
        </>
    );
};

export default Update;

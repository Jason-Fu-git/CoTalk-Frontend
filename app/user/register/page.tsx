'use client'
import React, {useState} from 'react';
import {BACKEND_URL, REGISTER_SUCCESS_PREFIX} from "../../constants/string";
import {useRouter} from "next/navigation";
import 'bootstrap/dist/css/bootstrap.css'
import {request} from '@/app/utils/network'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [phone, setphone] = useState('');
    const [avatar, setAvatar] = useState(typeof window !== 'undefined' ? new File([], "") : null);
    const [description, setdescription] = useState('');
    const router = useRouter();
    const defaultAvatar = '/DefaultAvatar.jpg';
    // const dispatch = store.dispatch;

    const register = async () => {
        const formData = new FormData();
        formData.append("user_name", username);
        formData.append("password", password);
        formData.append("user_email", email);
        if(description !== '') {
            formData.append("description", description);
        }
        if(phone !== '') {
            formData.append("phone", phone);
        }
        if (avatar != null && avatar.size !== 0) {
            formData.append("avatar", avatar);
        } else {
            //使用默认图片
            const defaultAvatarBlob = await fetch(defaultAvatar).then((res) => res.blob());
            formData.append("avatar", new File([defaultAvatarBlob], "DefaultAvatar.jpg"));
        }

        if (password !== confirmPassword) 
        {
            alert("密码不一致!")
        } 
        else
        {
            request(`${BACKEND_URL}/api/user/register`, "POST", false, "multipart/form-data", formData)
            .then((res) => {
                if (Number(res.code) === 0) {
                    router.push(`/user/login`);
                }
            })
            .catch((err)=>{
                alert(err);
            })
        }

    };

    return (
        <>
            <p className="lead">注册</p>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>*用户名</span>
                <input
                    className="form-control"
                    type="text"
                    placeholder="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>*密码</span>
                <input
                    className="form-control"
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>*确认密码</span>
                <input
                    className="form-control"
                    type="password"
                    placeholder="确认密码"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>*邮箱</span>
                <input
                    className="form-control"
                    type="email"
                    placeholder="邮箱"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>电话</span>
                <input
                    className="form-control"
                    type="text"
                    placeholder="电话"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>头像</span>
                <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setAvatar(e.target.files?.[0] as File)}
                />
            </div>
            <div className="input-group mb-3">
                <span style={{margin: "10px"}}>个人简介</span>
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

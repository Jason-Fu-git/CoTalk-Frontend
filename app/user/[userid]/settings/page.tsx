//实现用户信息更改
import React, { useState } from 'react';
import { request } from '@/app/utils/network';
import { BACKEND_URL } from '@/app/constants/string';
export default function Settingspage(){
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const update = () => {
        request(`${BACKEND_URL}/api/user/update`, "POST", false, {"user_name": user_name, "password": password,"email":email})
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("修改成功");
            }
            else {
                alert("修改失败");
            }
        })
        
    }
    
}
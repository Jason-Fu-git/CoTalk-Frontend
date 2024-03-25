'use client'
import React, { useState } from 'react';
import axios from 'axios';
// import * as Cookies from "js-cookie";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);


    const handleFileChange = (event: { target: { files: any[]; }; }) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          // @ts-ignore
            setAvatar(reader.result);
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
      event.preventDefault();

      const user = {
        user_name: username,
        password: password,
        email: email,
        avatar: avatar,
      };

      try {
        const response = await axios.post('/api/user/register', user);
        console.log(response.data);
        // Cookies.set('token', response.data.token);
      } catch (error) {
        console.error(error);
      }
    };

    // @ts-ignore
    return (
      <form onSubmit={handleSubmit}>
        <label>
          用户名:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          密码:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <label>
          邮箱:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
            头像:
        {/*<input type="file" onChange={handleFileChange} />*/}
      </label>
        <input type="submit" value="提交" />
      </form>
    );
  };

  export default RegisterPage;
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setAvatar(reader.result);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };
    
    const handleSubmit = async (event) => {
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
        Cookies.set('token', response.data.token);
      } catch (error) {
        console.error(error);
      }
    };
  
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
        <input type="file" onChange={handleFileChange} />
      </label>
        <input type="submit" value="提交" />
      </form>
    );
  };
  
  export default RegisterPage;
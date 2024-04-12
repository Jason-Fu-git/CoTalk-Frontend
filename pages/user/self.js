'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.css';

import React,{ useState, useEffect } from "react";
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";
import { BACKEND_URL } from '@/app/constants/string';

function Account() 
{
	//Set up general websocket with backend
    const url="ws://cotalkbackend-Concord.app.secoder.net/ws/?Authorization="+
		store.getState().auth.token+"&user_id="+store.getState().auth.id;
	const generalSocket=new WebSocket(url);

	//客户端收到消息时触发
    generalSocket.onmessage=function(event) {
        const data=JSON.parse(event.data);
        
        //防止自己发给自己
        console.log("Frontend receive: ");
        console.log(event);
        //将新消息添加到后面
        const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
        const datetime=new Date(data.datetime).toLocaleString('en', dateOptions);
        const sender_name=data.sender_name;
        const sender_id=data.sender_id;
              
        const newMessages=[{
            'id': count,
            'sender_name': sender_name,
            'sender_id': sender_id,
            'message': data.message,
            'datetime': datetime,
        }].concat(messages);
            
        setCount(count+1);
        setMessages(newMessages);
    };

    generalSocket.onclose=function(event) {
        console.error('Chat socket closed unexpectedly');
    };

    generalSocket.onopen=function(event) {
        console.log("Open websocket");
    };

  	const [current_name, setCurrentName] = useState("");
	const [current_email, setCurrentEmail] = useState("");
	const [current_description, setCurrentDescription] = useState("");
	const [avatar, setAvatar] = useState("");

  	useEffect(() => {
      	setCurrentName(store.getState().auth.name);
		setCurrentEmail(store.getState().auth.email);
		setCurrentDescription(store.getState().auth.description);
		request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}/avatar`, "GET", false)
		.then((blob) => {
			const url=URL.createObjectURL(blob);
			setAvatar(url);
		}
		);
  	}, []);

	const router = useRouter();
	
	const delete_user=() => {
        request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}`, "DELETE", true)
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("已删除该账号");
				router.push(`/`);
            }
        });
	}

    return (
        <div className="pt-0 sm:pt-16">
			<div className="dark:bg-gray-800 text-white w-12/12 shadow-lg sm:w-9/12 sm:m-auto">
				<div className="relative sm:w-full">
				<img
					src={avatar}
					alt={current_name}
					className="w-full h-96 object-cover object-center"
				/>
				<div className="bg-gray-800 bg-opacity-50 absolute flex items-end	w-full h-full top-0 left-0 p-8">
					<img
					src={avatar}
					alt={current_name}
					className="bg-gray-300 w-20 rounded-full mr-4"
					/>
					<div>
					<h1 className="font-bold text-3xl">
						{current_name} 的个人主页
					</h1>
					<p>{current_email}</p>
					</div>
				</div>
				</div>
				<div className="p-8">
					<p className="text-black dark:text-white">
						{current_description}
					</p>
					<div className="row gx-1">
						<div className="col">
						<Link href={`/user/self/update`} passHref>
							<button className="
								dark:bg-blue-400
								dark:text-gray-800
								bg-blue-400
								text-white
								font-semibold
								p-2
								rounded-md
								mt-6">
							修改个人信息
							</button>
						</Link>
						</div>
						<div className="col">
						<button className="
								dark:bg-blue-400
								dark:text-gray-800
								bg-blue-400
								text-white
								font-semibold
								p-2
								rounded-md
								mt-6"
							onClick={delete_user}>
						删除账户
						</button>
						</div>
					</div>
				</div>
			</div>
        </div>
    );
}

export default Account;

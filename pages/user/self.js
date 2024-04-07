'use client'
import React,{useState,useEffect} from "react";
import Link from "next/link";

import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";
import { BACKEND_URL } from '@/app/constants/string';

function Account() 
{
  	const [current_name, setCurrentName] = useState("");
	const [current_email, setCurrentEmail] = useState("");
	const [current_description, setCurrentDescription] = useState("");

  	useEffect(() => {
      	setCurrentName(store.getState().auth.name);
		setCurrentEmail(store.getState().auth.email);
		setCurrentDescription(store.getState().auth.description);

		request(`${BACKEND_URL}/api/user/private/${store.getState().auth.id}`, "GET", false)
		.then((res)=>{
			setCurrentName(res.user_name);
			setCurrentEmail((res.user_email === "") ? "邮箱为空" : res.user_email);
			setCurrentDescription((res.description === "") ? "目前还没有个人描述" : res.description);
		})
  	}, []);


    return (
        <div className="pt-0 sm:pt-16">
			<div className="dark:bg-gray-800 text-white w-12/12 shadow-lg sm:w-9/12 sm:m-auto">
				<div className="relative sm:w-full">
				<img
					src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
					alt={current_name}
					className="w-full h-96 object-cover object-center"
				/>
				<div className="bg-gray-800 bg-opacity-50 absolute flex items-end	w-full h-full top-0 left-0 p-8">
					<img
					src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
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
			</div>
        </div>
    );
}

export default Account;

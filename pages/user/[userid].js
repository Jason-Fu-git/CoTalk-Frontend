import {useEffect} from 'react';
import Link from 'next/link';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState } from "react";
import {request} from "@/app/utils/network";

export async function getServerSideProps({params}) 
{
	const {userid} = params;
	return {
		props: {
			userid
		}
	}
}

function Account({props}) 
{
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [description, setDescription] = useState("");

	request(`${BACKEND_URL}/api/user/${props.userid}`, "GET", false)
	.then((res)=>{
		setId(res.user_id);
		setName(res.user_name);
		setEmail((res.user_email === "") ? "邮箱为空" : res.user_email);
		setDescription((res.description === "") ? "目前还没有个人描述" : res.description);
	})

    return (
        <div className="pt-0 sm:pt-16">
          	<div className="dark:bg-gray-800 text-white w-12/12 shadow-lg sm:w-9/12 sm:m-auto">
				<div className="relative sm:w-full">
				<img
					src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
					alt={name}
					className="w-full h-96 object-cover object-center"
				/>
				<div className="bg-gray-800 bg-opacity-50 absolute flex items-end	w-full h-full top-0 left-0 p-8">
					<img
						src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
						alt={name}
						className="bg-gray-300 w-20 rounded-full mr-4"
					/>
					<div>
					<h1 className="font-bold text-3xl">
						{name}的个人主页
					</h1>
					<p>{email}</p>
				</div>
			</div>
            </div>
            <div className="p-8">
				<p className="text-black dark:text-white">
					{description}
				</p>
            </div>
          </div>
        </div>
      );
}

export default Account;
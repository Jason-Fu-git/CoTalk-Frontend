import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.css';
import React,{ useState, useEffect } from "react";

import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';

function UserCard(props) {
	const [avatar, setAvatar] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
  
	useEffect(() => {
	  request(`${BACKEND_URL}/api/user/private/${props.user_id}/avatar`, "GET", false)
		.then((url) => {
		  setAvatar(url);
		  setIsLoading(false);
		});
	}, []);
  
	if (isLoading) {
	  return <div>Loading...</div>;  // 或者你可以返回一个加载指示器
	}
  
	return (
	  <Link href={`/user/${props.user_id}`} passHref>
		<div className="card" style={{width: "18rem"}}>
		  <Image 
			src={avatar.url}
			width={avatar.width}
			height={avatar.height}
			className="card-img-top" 
			alt="search new users"
		  />
		  <div className="card-body">
			<h5 className="card-title">{props.user_name}</h5>
			<h6 className="card-subtitle mb-2 text-muted">{props.user_email}</h6>
			<span className="badge bg-secondary">
			  {props.user_tag}
			</span>
		  </div>
		</div>
	  </Link>
	);
  }
  
export default UserCard;
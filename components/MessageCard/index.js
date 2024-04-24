import { store } from "@/app/redux/store";
import Image from 'next/image';
import React,{ useState, useEffect } from "react";
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";

function MessageCard(props) 
{
	const [avatar, setAvatar] = useState('');
	useEffect(()=>{
		request(`${BACKEND_URL}/api/user/private/${props.sender_id}/avatar`, "GET", false)
		.then((url) => {
		setAvatar(url);
		});
	}, []);
	const my_id=store.getState().auth.id;

	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

	const onContextMenu = (event) => {
	  event.preventDefault();
  
	  setContextMenu({
		visible: true,
		x: event.clientX,
		y: event.clientY
	  });
	};
  
	const onClick = () => {
	  setContextMenu({ visible: false, x: 0, y: 0 });
	};

	if (props.sender_id === my_id)
	{
		return (
			<>
				<div onContextMenu={onContextMenu} onClick={onClick}>
					<div class="card text-white bg-success mb-3">
						<div class="card-header">
						</div>
						<div class="card-body">
							<div class="row g-0">
								<div class="col-md-4">
									<Image
										src={avatar.src?avatar.src:avatar.url}
										alt={props.sender_name}
										width={avatar.width}
										height={avatar.height}/>
								</div>
								<div class="col-md-8">
									<div class="card-body">
									<h1 className="dark:text-white text-3xl font-bold">
									{props.sender_name} {props.datetime}
									</h1>
									<h1 className="dark:text-white text-3xl font-bold">
									{props.message}
									</h1>
									</div>
								</div>
							</div>
						</div>
					</div>

					{contextMenu.visible && (
						<div style={{ 
							position: 'absolute', 
							top: contextMenu.y,
							left: contextMenu.x,
							backgroundColor: 'white' }}>
						<ul>
							<li>Option 1</li>
							<li>Option 2</li>
							<li>Option 3</li>
						</ul>
						</div>
					)}
				</div>
			</>
		)
	}
	else
	{
		return (
			<>
				<div onContextMenu={onContextMenu} onClick={onClick}>
					<div class="card">
						<div class="card-header">
						</div>
						<div class="card-body">
							<div class="row g-0">
								<div class="col-md-4">
									<Image
										src={(avatar.url) ? 
										(avatar.url):
										(avatar.src)}
										alt={props.sender_name}
										width={avatar.width}
										height={avatar.height}/>
								</div>
								<div class="col-md-8">
									<div class="card-body">
									<h1 className="dark:text-white text-3xl font-bold">
									{props.sender_name} {props.datetime}
									</h1>
									<h1 className="dark:text-white text-3xl font-bold">
									{props.message}
									</h1>
									</div>
								</div>
							</div>
						</div>
					</div>

					{contextMenu.visible && (
						<div style={{ 
							position: 'absolute', 
							top: contextMenu.y,
							left: contextMenu.x,
							backgroundColor: 'white' }}>
						<ul>
							<li>Option 1</li>
							<li>Option 2</li>
							<li>Option 3</li>
						</ul>
						</div>
					)}
				</div>
			</>
		);
	}

}

export default MessageCard;
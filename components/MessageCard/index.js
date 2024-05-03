import { store } from "@/app/redux/store";
import Image from 'next/image';
import React,{ useState, useEffect } from "react";
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";

function MessageCard(props) 
{
	// sender's avatar
	const [avatar, setAvatar] = useState('');
	useEffect(()=>
	{
		request(`${BACKEND_URL}/api/user/private/${props.sender_id}/avatar`, "GET", false)
		.then((url) => {
			setAvatar(url);
		});
	}, []);
	const my_id=store.getState().auth.id;

	// right click menu
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

	const onContextMenu = (event) => 
	{
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

	if (props.type === 'system')
	{
		return (
			<>
				<div onContextMenu={onContextMenu} onClick={onClick}>
					<span className="badge bg-secondary">
						{props.message} - {props.datetime} 
					</span>

					{contextMenu.visible && (
						<div 
							style={{ 
							top: contextMenu.y,
							left: contextMenu.x,
							backgroundColor: 'white' }}
							class="list-group">
							<button 
								type="button" 
								class="list-group-item list-group-item-action"
								onClick={()=>props.onDelete(props.message_id)}>
								删除
							</button>
						</div>
					)}
				</div>
			</>
		)
	}
	else if (props.sender_id === my_id)
	{
		return (
			<>
				<div onContextMenu={onContextMenu} onClick={onClick}>
					<div class="card text-white bg-success mb-3">
						<div class="card-header">
						</div>
						<div class="card-body">
							<div class="row g-0">
								<div class="col-md-3">
									<Image
										src={avatar.src?avatar.src:avatar.url}
										alt={props.sender_name}
										width={avatar.width/2}
										height={avatar.height/2}/>
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
						<div 
							style={{ 
							top: contextMenu.y,
							left: contextMenu.x,
							backgroundColor: 'white' }}
							class="list-group">
							<button 
								type="button" 
								class="list-group-item list-group-item-action"
								onClick={()=>props.onWithdrew(props.message_id)}>
								撤回
							</button>
							<button 
								type="button" 
								class="list-group-item list-group-item-action"
								onClick={()=>props.onDelete(props.message_id)}>
								删除
							</button>
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
										width={avatar.width/2}
										height={avatar.height/2}/>
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
						<div 
							style={{ 
							top: contextMenu.y,
							left: contextMenu.x,
							backgroundColor: 'white' }}
							class="list-group">
							<button 
								type="button" 
								class="list-group-item list-group-item-action">
							回复
							</button>
							<button 
								type="button" 
								class="list-group-item list-group-item-action"
								onClick={()=>props.onDelete(props.message_id)}>
							删除
							</button>
						</div>
					)}
				</div>
			</>
		);
	}

}

export default MessageCard;
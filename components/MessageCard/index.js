import 'bootstrap/dist/css/bootstrap.css';
import Image from 'next/image';
import React,{ useState, useEffect } from "react";

import { store } from "@/app/redux/store";
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";

class MessageCard extends React.Component
{
	cardRef = React.createRef();
	constructor (props)
	{
		super(props);
		this.state={
			contextMenu: { visible: false, x: 0, y: 0 },

			sender_name: props.sender_name,
			sender_id: props.sender_id,
			sender_avatar: '',
		  
			message: props.message,
			message_id: props.message_id,
		  
			datetime: props.datetime,
		  
			onDelete: props.onDelete,
			onWithdrew: props.onWithdrew,
			onReply: props.onReply,

			type: props.type,

			reply_target: props.reply_target,
			reply_name: (props.reply_target===-2) ? '':props.reply_name,
			reply_message: (props.reply_target===-2) ? '消息已删除':props.reply_message,

			hasread: props.hasread,

			reply: false,
			replyValue: '',
		};
		// Create a reference to the "card" component
		this.id=store.getState().auth.id;
		if (props.type !== 'system')
		{
			request(`${BACKEND_URL}/api/user/private/${props.sender_id}/avatar`, "GET", false)
			.then((url) => {
				this.setState({sender_avatar: url});
			});
		}

		if (this.state.reply_target>0)
		{
			console.log("RECEIVE TARGET REF FOR: "+this.state.message_id);
			console.log(props.reply_ref);
			this.reply_ref=props.reply_ref;
		}
	}

	handleReplyChange = (event) =>
	{
	  	this.setState({
			replyValue: event.target.value
		});
	};

	handleSend = () =>
	{
		if (this.state.replyValue)
		{
			this.state.onReply(this.state.message_id, this.state.replyValue);
		}
		this.setState({
			reply: false,
			replyValue: '',
		})
	};

	handleJump = (target_id) =>
	{
		if (target_id === -2)
		{
			alert("无法跳转");
			return;
		}
		else
		{
			this.reply_ref.current.scrollToCard();
		}
	}

	scrollToCard = () =>
	{
		this.cardRef.current.scrollIntoView({ behavior: 'smooth' });
	}

	onContextMenu = (event) =>
	{
		event.preventDefault();
	
		this.setState({
			contextMenu: {
				visible: true,
				x: event.clientX,
				y: event.clientY
			}
		})
	};
  
	onClick = () =>
	{
		this.setState({
			contextMenu: { visible: false, x: 0, y: 0 }
		})
	};

	componentDidUpdate(prevProps)
	{
		if (this.state.reply_target>0)
		{
			console.log("UPDATE JUMP REFERENCE FOR "+this.state.message_id);
			console.log(this.props.reply_ref);
			this.reply_ref=this.props.reply_ref;
		}
		if ((this.props.reply_target===-2)&&(this.state.reply_name!==''))
		{
			this.setState({
				reply_target:-2,
				reply_name:'',
				reply_message:'消息已删除',
			})
		}
	}

	render() 
	{
		if (this.state.type === 'system')
		{
			return (
				<div ref={this.cardRef}>
					<div onContextMenu={this.onContextMenu} onClick={this.onClick}>
						<span className="badge bg-secondary">
							{this.state.message} - {this.state.datetime} 
						</span>

						{this.state.contextMenu.visible && (
							<div 
								style={{ 
								top: this.state.contextMenu.y,
								left: this.state.contextMenu.x,
								backgroundColor: 'white' }}
								className="list-group">
								<button 
									type="button" 
									className="list-group-item list-group-item-action"
									onClick={()=>this.state.onDelete(this.state.message_id)}>
									删除
								</button>
							</div>
						)}
					</div>
				</div>
			)
		}
		else if (this.state.sender_id === this.id)
		{
			return (
				<div ref={this.cardRef}>
					<div onContextMenu={this.onContextMenu} onClick={this.onClick}>
						<div className="card text-white bg-success mb-3">
							<div className="card-header">
							</div>
							<div className="card-body">
								<div className="row g-0">
									<div className="col-md-3">
										<Image
											src={this.state.sender_avatar.src ? this.state.sender_avatar.src : this.state.sender_avatar.url}
											alt={this.state.sender_name}
											width={this.state.sender_avatar.width}
											height={this.state.sender_avatar.height}/>
									</div>
									<div className="col-md-8">
										<div className="card-body">
										<h1 className="dark:text-white text-3xl font-bold">
										{this.state.sender_name} {this.state.datetime}
										</h1>
										<h1 className="dark:text-white text-3xl font-bold">
										{this.state.message}
										</h1>
										</div>
									</div>
								</div>
							</div>
							{this.state.hasread}

							{(this.state.reply_target !== -1)&& (
							<div 
								className="card-footer"
								style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
								<h1 className="dark:text-white text-2xl font-bold">
								回复{this.state.reply_name}: {this.state.reply_message}
								</h1>
								<div className="col-auto">
								<button 
									name="submit"
									className="btn btn-primary"
									onClick={()=>{this.handleJump(this.state.reply_target)}}
								>
								跳转
								</button>
								</div>								
							</div>
							)}
						</div>

						{this.state.contextMenu.visible && (
							<div 
								style={{ 
								top: this.state.contextMenu.y,
								left: this.state.contextMenu.x,
								backgroundColor: 'white' }}
								className="list-group">
								<button 
									type="button" 
									className="list-group-item list-group-item-action"
									onClick={()=>this.state.onWithdrew(this.state.message_id)}>
									撤回
								</button>
								<button 
									type="button" 
									className="list-group-item list-group-item-action"
									onClick={()=>this.state.onDelete(this.state.message_id)}>
									删除
								</button>
							</div>
						)}
					</div>
				</div>
			)
		}
		else
		{
			return (
				<div ref={this.cardRef}>
					<div onContextMenu={this.onContextMenu} onClick={this.onClick}>
						<div className="card">
							<div className="card-header">
							</div>
							<div className="card-body">
								<div className="row g-0">
									<div className="col-md-3">
										<Image
											src={(this.state.sender_avatar.url) ? 
											(this.state.sender_avatar.url):
											(this.state.sender_avatar.src)}
											alt={this.state.sender_name}
											width={this.state.sender_avatar.width}
											height={this.state.sender_avatar.height}/>
									</div>
									<div className="col-md-8">
										<div className="card-body">
										<h1 className="dark:text-white text-3xl font-bold">
										{this.state.sender_name} {this.state.datetime}
										</h1>
										<h1 className="dark:text-white text-3xl font-bold">
										{this.state.message}
										</h1>
										</div>
									</div>
								</div>
							</div>
							{this.state.hasread}

							{(this.state.reply_target !== -1)&& (
							<div 
								className="card-footer"
								style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
								<h1 className="dark:text-white text-2xl font-bold">
								回复{this.state.reply_name}: {this.state.reply_message}
								</h1>
								<button 
									name="submit"
									className="btn btn-primary"
									onClick={()=>{this.handleJump(this.state.reply_target)}}
								>
								跳转
								</button>
							</div>
							)}
						</div>

						{this.state.contextMenu.visible && (
							<div 
								style={{ 
								top: this.state.contextMenu.y,
								left: this.state.contextMenu.x,
								backgroundColor: 'white' }}
								className="list-group">
								<button 
									type="button" 
									className="list-group-item list-group-item-action"
									onClick={()=>{
										this.state.reply=true;
								}}>
								回复
								</button>
								<button 
									type="button" 
									className="list-group-item list-group-item-action"
									onClick={()=>this.state.onDelete(this.state.message_id)}>
								删除
								</button>
							</div>
						)}
						{
							this.state.reply && (
							<div 
								className="list-group-item"
								style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
								<input
									className="form-control col_auto"
									type="text"
									placeholder="请输入回复内容"
									value={this.state.replyValue}
									onChange={this.handleReplyChange}
								/>
								<div className="col-auto">
									<button 
										name="submit"
										className="btn btn-primary"
										onClick={this.handleSend}
									>
									发送
									</button>
								</div>
								<div className="col-auto">
									<button 
										name="submit"
										className="btn btn-primary"
										onClick={()=>{
											this.setState({
												reply: false,
											});
										}}
									>
									取消
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			);
		}
	}
}

export default MessageCard;
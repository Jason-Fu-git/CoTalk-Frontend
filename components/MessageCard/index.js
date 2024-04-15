import { store } from "@/app/redux/store";
import Image from 'next/image';

function MessageCard(props) 
{
	const my_id=store.getState().auth.id;
	if (props.sender_id === my_id)
	{
		return (
			<>
				<div class="card text-white bg-success mb-3">
					<div class="card-header">
					</div>
					<div class="card-body">
						<div class="row g-0">
							<div class="col-md-4">
								<Image
									src={(props.sender_avatar.url) ? 
									(props.sender_avatar.url):
									(props.sender_avatar.src)}
									alt={props.sender_name}
									width={props.sender_avatar.width}
									height={props.sender_avatar.height}/>
							</div>
							<div class="col-md-8">
								<div class="card-body">
								<h1 className="dark:text-white text-3xl font-bold">
                				{props.sender_name}
                				</h1>
								<h1 className="dark:text-white text-3xl font-bold">
                				{props.message}
                				</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
	else
	{
		return (
			<>
				<div class="card">
					<div class="card-header">
					</div>
					<div class="card-body">
						<div class="row g-0">
							<div class="col-md-4">
								<Image
									src={(props.sender_avatar.url) ? 
									(props.sender_avatar.url):
									(props.sender_avatar.src)}
									alt={props.sender_name}
									width={props.sender_avatar.width}
									height={props.sender_avatar.height}/>
							</div>
							<div class="col-md-8">
								<div class="card-body">
								<h1 className="dark:text-white text-3xl font-bold">
                				{props.sender_name}
                				</h1>
								<h1 className="dark:text-white text-3xl font-bold">
                				{props.message}
                				</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

}

export default MessageCard;
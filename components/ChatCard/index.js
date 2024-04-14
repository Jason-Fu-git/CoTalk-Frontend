import Link from 'next/link';
import { useEffect,useState } from 'react';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from '@/app/utils/network';
function ChatCard(props) {
	const[name, setName] = useState('');
	const [chat_type,setchat_type]=useState('');
	useEffect(() => {
	if(props.chat_name.includes("Private")){
		setchat_type("私聊");
		const friendid=props.chat_name[props.chat_name.length-1];
		request(`${BACKEND_URL}/api/user/private/${friendid}`, "GET", false)
		.then((res) => {
			setName(res.user_name);
		});
	}
	else{
		setName(props.chat_name);
		setchat_type("群聊");
	}
	}
	, []);
  return (
	<>
		<Link href={`/chat/${props.chat_id}/conversation`} passHref>
			<div className="card" style={{width: "18rem"}}>
				<div className="card-body">
					<h5 className="card-title">{name}</h5>
					<p className="card-text">{chat_type}</p>
				</div>
			</div>
		</Link>
	</>
  );
}

export default ChatCard;
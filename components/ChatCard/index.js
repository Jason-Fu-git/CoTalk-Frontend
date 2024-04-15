import Link from 'next/link';
import { useEffect,useState } from 'react';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from '@/app/utils/network';
import{store} from '@/app/redux/store';
function ChatCard(props) {
	const[name, setName] = useState('');
	const [chat_type,setchat_type]=useState('');
	useEffect(() => {
	if(props.chat_name.includes("Private")){
		setchat_type("私聊");
		const nums = props.chat_name.split(' ')[1].split('&');
		console.log(nums);
    	const friendid = nums[0] === store.getState().auth.id.toString() ? nums[1] : nums[0];
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
import Link from 'next/link';

function ChatCard(props) {
  return (
	<>
		<Link href={`/chat/${props.chat_id}`} passHref>
			<div className="card text-center" style={{width: "18rem"}}>
				<div className="card-body">
					<h5 className="card-title">{props.chat_name}</h5>
					<p className="card-text">当前群聊没有描述</p>
				</div>
			</div>
		</Link>
	</>
  );
}

export default ChatCard;
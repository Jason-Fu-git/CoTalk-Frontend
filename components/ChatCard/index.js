import Link from 'next/link';

function ChatCard(props) {
  return (
	<>
		<Link href={`/chat/${props.chat_id}/conversation`} passHref>
			<div className="card" style={{width: "18rem"}}>
				<div className="card-body">
					<h5 className="card-title">{props.chat_name}</h5>
					<h6 className="card-subtitle mb-2 text-muted">当前群聊没有描述</h6>
					<h6 className="card-subtitle mb-2 text-muted">人数：-1</h6>
				</div>
			</div>
		</Link>
	</>
  );
}

export default ChatCard;
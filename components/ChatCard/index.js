import Link from 'next/link';

function ChatCard(props) {
  return (
	<>
		<Link href={`/chat/${props.chat_id}`} passHref>
			<div className="card" style={{width: "18rem"}}>
				<img 
					src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
					className="card-img-top" 
					alt="search new users"/>
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
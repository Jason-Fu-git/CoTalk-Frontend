import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

function ChatCard(props) {
  return (
	<>
		<div className="card text-center" style={{width: "18rem"}}>
			<div className="card-body">
				<h5 className="card-title">{props.chat_name}</h5>
				<p className="card-text">当前群聊没有描述</p>
				<a href="#" className="btn btn-primary">进入</a>
				<a href="#" className="btn btn-primary">更多信息</a>
			</div>
		</div>
	</>
  );
}

export default ChatCard;
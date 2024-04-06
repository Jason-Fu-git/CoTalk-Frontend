function MessageCard(props) {
  return (
	<>
        <div class="card">
            <div class="card-header">
            用户: {props.sender_id}
            </div>
            <div class="card-body">
            <blockquote class="blockquote mb-0">
                <p>{props.msg_text}</p>
                <footer class="blockquote-footer">
                    发送时间未知
                </footer>
            </blockquote>
            </div>
        </div>
	</>
  );
}

export default MessageCard;
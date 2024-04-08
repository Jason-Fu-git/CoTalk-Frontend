function MessageCard(props) {
  return (
	<>
        <div class="card">
            <div class="card-header">
            用户: {props.sender_name}
            </div>
            <div class="card-body">
            <blockquote class="blockquote mb-0">
                <p>{props.message}</p>
                <footer class="blockquote-footer">
                {props.datetime}
                </footer>
            </blockquote>
            </div>
        </div>
	</>
  );
}

export default MessageCard;
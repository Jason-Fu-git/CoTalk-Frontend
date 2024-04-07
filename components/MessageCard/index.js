function MessageCard(props) {
  return (
	<>
        <div class="card">
            <div class="card-header">
            用户: {props.sender}
            </div>
            <div class="card-body">
            <blockquote class="blockquote mb-0">
                <p>{props.text}</p>
                <footer class="blockquote-footer">
                {props.time}
                </footer>
            </blockquote>
            </div>
        </div>
	</>
  );
}

export default MessageCard;
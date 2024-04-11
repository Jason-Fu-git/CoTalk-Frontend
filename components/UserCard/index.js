import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

function UserCard(props) {
  return (
    <Link href={`/user/${props.user_id}`} passHref>
        <div className="card" style={{width: "18rem"}}>
            <img 
                src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
                className="card-img-top" 
                alt="search new users"/>
            <div className="card-body">
                <h5 className="card-title">{props.user_name}</h5>
				<h6 className="card-subtitle mb-2 text-muted">{props.user_email}</h6>
				<span className="badge bg-secondary">
				{(props.is_friend)? "好友" : "陌生人"}
				</span>
            </div>
        </div>
    </Link>
  );
}

export default UserCard;
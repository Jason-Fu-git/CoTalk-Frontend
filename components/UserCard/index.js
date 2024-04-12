import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import { request } from "@/app/utils/network";
import { BACKEND_URL } from '@/app/constants/string';
function UserCard(props) {
  const getavator=(id)=>{
    request(`${BACKEND_URL}/api/user/private/${id}/avatar`, "GET", false)
    .then((blob) => {
      return(URL.createObjectURL(blob));
    });
  }
  return (
    <Link href={`/user/${props.user_id}`} passHref>
        <div className="card" style={{width: "18rem"}}>
            <img 
                src={getavator(props.user_id)}
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
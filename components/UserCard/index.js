import Link from 'next/link';

function UserCard(props) {
  return (
    <Link href={`/user/${props.user_id}`} passHref>
        <div className="card" style={{width: "18rem"}}>
            <img 
                src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
                className="card-img-top" 
                alt="search new users"/>
            <div className="card-body">
                <h5 class="card-title">{props.user_name}</h5>
				<h6 class="card-subtitle mb-2 text-muted">{props.user_email}</h6>
            </div>
        </div>
		<div className="dark:bg-gray-800 bg-gray-100 cursor-pointer dark:text-white p-4 rounded-md text-center shadow-xl">
			<img
			src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
			alt={props.user_name}
			className="w-16 bg-gray-400 rounded-full m-auto"
			/>
			<div className="mt-2 font-bold">
			{props.user_name}
			</div>
			<div className="font-light">{props.user_email}</div>
		</div>
    </Link>
  );
}

export default UserCard;
import Link from 'next/link';
import Image from 'next/image';

function UserCard(props) {
  return (
    <Link href={`/user/${props.user_id}`} passHref>
      <div className="dark:bg-gray-800 bg-gray-100 cursor-pointer dark:text-white p-4 rounded-md text-center shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
          alt={props.user_name}
          className="w-16 bg-gray-400 rounded-full m-auto"
        />
        <div className="mt-2 font-bold">
          {props.user_name}
        </div>
        <div className="font-light">用户描述为空</div>
      </div>
    </Link>
  );
}

export default UserCard;
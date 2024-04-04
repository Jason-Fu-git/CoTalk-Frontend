import Link from "next/link";

function TopBar() 
{
  	return (
    <div className="w-full p-2 bg-blue-300 flex auto">
		<div className="w-10/12 m-auto">
			<Link href={`/user/self/friends`} passHref>
                <button className="
                    dark:bg-blue-400
                    dark:text-gray-800
                    bg-blue-400
                    text-white
                    font-semibold
                    p-2
                    rounded-md">
                  所有好友
                </button>
            </Link>
		</div>
		<div className="w-10/12 m-auto">
			<Link href={`/user/self`} passHref>
                <button className="
                    dark:bg-blue-400
                    dark:text-gray-800
                    bg-blue-400
                    text-white
                    font-semibold
                    p-2
                    rounded-md">
                  个人主页
                </button>
            </Link>
		</div>
		<div className="w-10/12 m-auto">
			<Link href={`/`} passHref>
                <button className="
                    dark:bg-blue-400
                    dark:text-gray-800
                    bg-blue-400
                    text-white
                    font-semibold
                    p-2
                    rounded-md">
                  登出
                </button>
            </Link>
		</div>
    </div>
  	);
}

export default TopBar;
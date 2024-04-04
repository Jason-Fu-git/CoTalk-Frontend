import Link from "next/link";
import { useTheme } from 'next-themes';

function TopBar() 
{
	const { theme, setTheme } = useTheme();
	const dark = theme === 'dark';
  
	const toggleTheme = () => {
	  setTheme(dark ? 'light' : 'dark');
	};

  	return (
    <div className="w-full p-2 bg-blue-300 flex space-x-4">
		<div className="w-10/12 m-auto">
			<button 
				onClick={toggleTheme}
				className="
				dark:bg-blue-400
				dark:text-gray-800
				bg-blue-400
				text-white
				font-semibold
				p-2
				rounded-md">
			更改色调
			</button>
		</div>
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
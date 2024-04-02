import {useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';
const BACKEND_URL = "https://cotalkbackend-concord.app.secoder.net";

export async function getServerSideProps(ctx) {
    const {userid}=ctx.query;
//    const userReq=await axios.get(`${BACKEND_URL}/api/user/${userid}`);
    console.log(userid);
    if (userid == 1)
    {
        const userReq={
            "data":{
                "user_name":"Test1",
                "user_email":"test1@xxx.com"
            }
        }; 
        return {
            props: {
                user: userReq.data
            }
        }     
    }
    if (userid == 2)
    {
        const userReq={
            "data":{
                "user_name":"Test2",
                "user_email":"test2@xxx.com"
            }
        };   
        return {
            props: {
                user: userReq.data
            }
        }    
    }
    else
    {
        const userReq={
            "data":{
                "user_name":"Test",
                "user_email":"test@xxx.com"
            }
        };  
        return {
            props: {
                user: userReq.data
            }
        }
    }
}

function Account({user}) {
    return (
        <div className="pt-0 sm:pt-16">
          <div className="dark:bg-gray-800 text-white w-12/12 shadow-lg sm:w-9/12 sm:m-auto">
            <div className="relative sm:w-full">
              <img
                src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
                alt={user.user_name}
                className="w-full h-96 object-cover object-center"
              />
              <div className="bg-gray-800 bg-opacity-50 absolute flex items-end	w-full h-full top-0 left-0 p-8">
                <img
                  src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
                  alt={user.user_name}
                  className="bg-gray-300 w-20 rounded-full mr-4"
                />
                <div>
                  <h1 className="font-bold text-3xl">
                    {user.user_name}
                  </h1>
                  <p>{user.user_email}</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-black dark:text-white">本人无个人描述</p>
              <Link href={`/user/${user.user_id}/friends`} passHref>
                <button className="
                    dark:bg-green-400
                    dark:text-gray-800
                    bg-green-400
                    text-white
                    font-semibold
                    p-2
                    rounded-md
                    mt-6">
                  返回
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
}

export default Account;
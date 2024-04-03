import {useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';
import {BACKEND_URL} from '@/app/constants/string';
import React, { useState } from "react";
import {request} from "@/app/utils/network";

export async function getServerSideProps({params:{userid}}) 
{
	request(`${BACKEND_URL}/api/user/${userid}`, "GET", false)
	.then((res)=>{
		return({
			props: {
				user: res
			}
		})
	})
}

function Account({user}) 
{
    return (
        <div className="pt-0 sm:pt-16">
          <div className="dark:bg-gray-800 text-white w-12/12 shadow-lg sm:w-9/12 sm:m-auto">
            <div className="relative sm:w-full">
              {/* <img
                src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
                alt={user.user_name}
                className="w-full h-96 object-cover object-center"
              /> */}
              <div className="bg-gray-800 bg-opacity-50 absolute flex items-end	w-full h-full top-0 left-0 p-8">
                {/* <img
                  src="https://images.unsplash.com/photo-1605460375648-278bcbd579a6"
                  alt={user.user_name}
                  className="bg-gray-300 w-20 rounded-full mr-4"
                /> */}
                <div>
                  <h1 className="font-bold text-3xl">
                    {user.user_name}的个人主页
                  </h1>
                  <p>{user.user_email}</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-black dark:text-white">本人无个人描述</p>
              <Link href={`/user/self/friends`} passHref>
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
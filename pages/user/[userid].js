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
        <>
            <div>
                <Link href="/" passHref>
                    Back to home
                </Link>
            </div>
            <div>
                <div>
                    <b>Username:</b> {user.user_name}
                </div>
                <div>
                    <b>Email:</b> {user.user_email}
                </div>
            </div>
        </>
    )
}

export default Account;
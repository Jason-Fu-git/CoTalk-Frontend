import Link from 'next/link';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css'
import UserCard from '../../../components/UserCard';

const BACKEND_URL = "https://cotalkbackend-concord.app.secoder.net";

export async function getServerSideProps(ctx) {
    const { userid }=ctx.query;
//    const friendsReq=await axios.get(`${BACKEND_URL}/api/user/${userid}/friends`);
    const friendsReq={
        "data": [
            {
                "user_name":"Test1",
                "user_id":1
            },
            {
                "user_name":"Test2",
                "user_id":2
            },
        ]
    }
    return {
        props: {
            users: friendsReq.data
        }
    }
}

function Friends({ users }) {
    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-5xl font-bold text-center">
                    所有好友
                </h1>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {users.map((user) => (
                        <div key={user.user_id}>
                            <UserCard {...user}/>
                        </div>
                    ))}
                </div>
            </div> 
        </>
    )
}

export default Friends;
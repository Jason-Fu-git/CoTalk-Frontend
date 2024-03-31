import Link from 'next/link';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css'

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
            <p className="lead">所有好友</p>
            <ul>
            {
                users.map((user) =>
                    <div className="d-flex position-relative">
                    <img src="..." class="flex-shrink-0 me-3" alt="..."/>
                        <div>
                        <h5 class="mt-0">{user.user_name}</h5>
                        <p>邮箱：xxx</p>
                        </div>
                    </div>
                )
            }
            </ul>
        </>
    )
}

export default Friends;
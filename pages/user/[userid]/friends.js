import {useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';
const BACKEND_URL = "https://cotalkbackend-concord.app.secoder.net";

export async function getServerSideProps(ctx) {
    const { userid }=ctx.query;
    const friends=await axios.get(`${BACKEND_URL}/api/user/${userid}/friends`);
    
    return {
        props: {
            users: friends.data
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
                    <li key={user.id}>
                        <Link
                            href={'/users/${user.id}'}
                            passHref
                        >
                        {user.username}
                        </Link>
                    </li>
                )
            }
            </ul>
        </>
    )
}

export default Friends;
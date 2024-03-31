import {useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios'

export async function getServerSideProps() {
    const { userid }=ctx.query;
    const friends=await axios.get(`https://localhost:8000/api/user/${userid}/friends`);
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
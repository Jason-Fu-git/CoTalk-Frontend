import {useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';

export async function getServerSideProps(ctx) {
    const {userid}=ctx.query;
    const userReq=await axios.get(`https://localhost:8000/api/user/${userid}`);

    return {
        props: {
            user: userReq.data
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
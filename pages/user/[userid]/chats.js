import Link from 'next/link';
import axios from 'axios';
const BACKEND_URL = "https://cotalkbackend-concord.app.secoder.net";

export async function getServerSideProps(ctx) {
    const { userid }=ctx.query;
    const friends=await axios.get(`${BACKEND_URL}/api/user/${userid}/chats`);
    
    return {
        props: {
            chats: friends.data
        }
    }
}

function Chats({ chats }) {
    return (
        <>
            <p className="lead">所有好友</p>
            <ul>
            {
                chats.map((chat) =>
                    <li key={chat.user_id}>
                        <Link
                            href={'/'}
                            passHref
                        >
                        {chat.chat_name}
                        </Link>
                    </li>
                )
            }
            </ul>
        </>
    )
}

export default Chats;
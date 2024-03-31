import {useEffect} from 'react';
import Link from 'next/link';
import axios from 'axios';

export async function getServerSideProps(ctx) {
    const {userid}=ctx.query;
    const userReq=await axios.get('https://localhost:8000/api/')
}

function Account(props) {
    return (
        <>
            <div>
                User ID: {props.userid}.
            </div>
        </>
    )
}

export default Account;
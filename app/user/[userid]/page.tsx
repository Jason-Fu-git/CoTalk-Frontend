'use client'
import React from "react";
import { store } from "@/app/redux/store";
import Link from "next/link";
import { resetAuth } from "@/app/redux/auth";
import { routeModule } from "next/dist/build/templates/app-page";
import { useRouter } from "next/navigation";
export default function Page({ params }: { params: { userid: number } }) {
    const name=store.getState().auth.name
    const dispatch = store.dispatch;
    const router = useRouter();
    const handleLogout = () => {
        dispatch(resetAuth());
        router.push("/user/login");
    }
    return (
        <div>
            <p>my name:{name}</p>
            <p>My id: {params.userid}</p>
            <p>
                <Link href={`/user/${params.userid}/friends`}>My friends</Link>
            </p>
            <p>
                <Link href={`/user/${params.userid}/chat`}>My chat</Link>
            </p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
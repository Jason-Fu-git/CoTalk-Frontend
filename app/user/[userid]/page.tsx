import React from "react";
import store from "@/app/redux/store";
export default function Page({ params }: { params: { userid: number } }) {
    const name: string=store.getState().auth.name;
    if(name===""){
        return <div>Not logged in</div>
    }
    return (
        <div>
            <p>My name: {name}</p>
            <p>My id: {params.userid}</p>
        </div>
    )
}
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import {useRouter} from 'next/router';

import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";

function getMessageCard(props)
{
    console.log("Making message card for: "+props);
    const my_id=store.getState().auth.id;

    if (props.sender_id === my_id)
	{
		return (
			<>
			    <div class="card text-white bg-success mb-3">
					<div class="card-header">
                        {props.sender_name} - {props.datetime}
					</div>
					<div class="card-body">
                        {props.message}
					</div>
				</div>
			</>
		);
	}
	else
	{
		return (
			<>
				<div class="card">
					<div class="card-header">
                        {props.sender_name} - {props.datetime}
					</div>
					<div class="card-body">
                        {props.message}
					</div>
				</div>
			</>
		);
	}
}

function SearchHistory() 
{
    const router = useRouter();
    const {chatid} = router.query;

    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [hassubmitsearch, setHassubmitsearch] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [firstRender, setFirstRender]=useState(true);

    useEffect(() => {
        if(firstRender){
            setFirstRender(false);
            return;
        }

        const url=`${BACKEND_URL}/api/chat/${chatid}/messages?user_id=`+
            store.getState().auth.id+
            "&filter_user="+store.getState().auth.id+
            "&filter_text='"+query+"'";

        console.log("Loading search result: "+url);

        request(url, "GET", true)
        .then(async (res) => 
        {
            const promises = res.messages.map(async function (element, index)
            {
                const sender_id=element.sender_id;
                let sender_name="??";
                await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                .then((res) => {
                    sender_name=res.user_name;
                });
                const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
                const datetime = new Date(element.create_time).toLocaleString('en', dateOptions);
    
                return ({
                    'index': index,
                    'sender_name': sender_name,
            
                    'message': element.msg_text,
    
                    'datetime': datetime,
                });
            });
            const search= await Promise.all(promises); 
            console.log("Search result: "+search);
            setSearchResult(search);
        });

        setHasSearched(false);
    },[hasSearched]);

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    搜索聊天记录
                </h1>
                <div className="input-group mb-3">
                    <input
                        className="form-control col_auto"
                        type="text"
                        placeholder="搜索关键词"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="col-auto">
                        <button 
                            name="submit"
                            className="btn btn-primary"
                            onClick={() => {
                                setHasSearched(true);
                            }}
                        >
                        搜索
                        </button>
                    </div>
                </div>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                    ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {hassubmitsearch&&(searchResult.length > 0 ? (
                        searchResult.map((message) => 
                        (
                            <div key={message.index}>
                                {getMessageCard(message)}
                            </div>
                        )
                    )) : (
                        <p>没有搜索结果</p>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SearchHistory;
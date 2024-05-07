import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";
import {useRouter} from 'next/router';

import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";

function SearchHistory() 
{
    const router = useRouter();
    const {chatid} = router.query;

    const [searchResult, setSearchResult] = useState([]);
    const [firstRender, setFirstRender]=useState(true);
    const [toggle, setToggle]=useState(true);
    const [selectedUser,setSelectedUser]=useState('');
    const [members,setMembers]=useState([]);

    const updateSearch = function (search)
    {
        setSearchResult(oldMessages => 
        {
            return search;
        });
    };

    const getMessageCard=function (props)
    {
        console.log("Making message card for: ");
        console.log(props);
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


    useEffect(() => {
        if(firstRender){
            setFirstRender(false);
            request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
            .then((res) => {
                setMembers(res.members);
            });  
            return;
        }
        let inputArea=document.getElementById('search-input');
        const query=inputArea.value;

        let url=`${BACKEND_URL}/api/chat/${chatid}/messages?user_id=`+
            store.getState().auth.id+
            "&filter_text="+query;
        if(selectedUser!=''){
            url+="&filter_user="+selectedUser;
        }
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
                const dateOptions={ hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Shanghai' };
                const datetime = new Date(element.create_time*1000).toLocaleString('en-US', dateOptions);
    
                return ({
                    'index': index,
                    'sender_id': sender_id,
                    'sender_name': sender_name,
            
                    'message': element.msg_text,
    
                    'datetime': datetime,
                });
            });
            const search= await Promise.all(promises); 
            updateSearch(search)
            inputArea.value='';
            inputArea.focus();
        });
    },[toggle]);

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
                        id="search-input"
                    />
                    <div className="col-auto">
                        <button 
                            name="submit"
                            className="btn btn-primary"
                            onClick={() => {
                                setToggle(!toggle);
                            }}
                        >
                        搜索
                        </button>
                    </div>
                </div>
                <div>
                    <p>请选择一个用户：</p>
                    <div>
                        <input 
                            type="radio" 
                            className="btn-check" 
                            autoComplete="off"
                            id="none"
                            checked={selectedUser === ''}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedUser('');
                                }
                            }}/>
                        <label 
                            className="btn btn-outline-primary" 
                            htmlFor="none">
                        不选择任何用户
                        </label>
                    </div>
                    {members.map((member, index) => (
                        <div key={index}>
                            <input 
                                type="radio" 
                                className="btn-check" 
                                autoComplete="off"
                                id={member.user_id}
                                checked={selectedUser === member.user_id}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedUser(member.user_id);
                                    }
                                }}/>
                            <label 
                                className="btn btn-outline-primary" 
                                htmlFor={member.user_id}>
                            {member.user_name}
                            </label>
                        </div>
                    ))}
                </div>
                {(searchResult.length > 0 ? (
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
        </>
    )
}

export default SearchHistory;
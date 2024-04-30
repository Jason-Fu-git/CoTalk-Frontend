import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";

import MessageCard from '@/components/MessageCard';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";

function Search() 
{
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [hassubmitsearch, setHassubmitsearch] = useState(false);


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
                        searchResult.map((user) => (
                            <div key={user.user_id}>
                                <MessageCard {...user}/>
                            </div>
                        ))
                    ) : (
                        <p>没有搜索结果</p>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Search;
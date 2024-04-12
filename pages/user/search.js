import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";

import UserCard from '@/components/UserCard';
import { BACKEND_URL } from '@/app/constants/string';
import { request } from "@/app/utils/network";
import { store } from "@/app/redux/store";

function Search() 
{
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [hassubmitsearch, setHassubmitsearch] = useState(false);

    const my_friends=store.getState().auth.friends;
    
    useEffect(() => {
        console.log("Loading search result");
        request(`${BACKEND_URL}/api/user/search?search_text=${query}`, "GET", true)
        .then((res) => {
            res.users.forEach(function (element, index, array){
                element.is_friend=my_friends.includes(Number(element.user_id));
            });

            const users=res.users.filter(function(element){
                return (element.user_id !== store.getState().auth.id)
            });

            setSearchResult(users);
        });
        setHasSearched(false);
    },[hasSearched]);


    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center">
                    搜索用户
                </h1>
                <div className="input-group mb-3">
                    <input
                        className="form-control col_auto"
                        type="text"
                        placeholder="搜索用户名"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="col-auto">
                        <button 
                            name="submit"
                            className="btn btn-primary"
                            onClick={() => {
                                setHasSearched(true);
                                setHassubmitsearch(true);
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
                                <UserCard {...user}/>
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
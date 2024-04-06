import 'bootstrap/dist/css/bootstrap.css';
import React, { useState, useEffect } from "react";

import UserCard from '@/components/UserCard';
import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";

function Search() 
{
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [hasSearched, setHasSearched] = useState(true);
    
    useEffect(() => {
        request(`${BACKEND_URL}/api/user/?search_text=abc`, "GET", true)
        .then((res) => {
            setSearchResult(res.users);
        });
    }, []);

    /*    
    const handleSearch = () => {
        setHasSearched(true);
        console.log("SSSSJ");
        request(`${BACKEND_URL}/api/user/?search_text=${query}`, "GET", false)
        .then((res) => {
            setSearchResult(res.users);
        });
    };
*/
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
                        >
                        搜索
                        </button>
                    </div>
                </div>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                    ml-8 mr-8 sm:mr-0 sm:ml-0">
                    {hasSearched && (searchResult.length > 0 ? (
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
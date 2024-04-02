'use client'
import React, { useState } from "react";
import { request } from "@/app/utils/network";
import { BACKEND_URL } from "@/app/constants/string";

export default function Friendpage({ params }: { params: { userid: number } }) {
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  request(`${BACKEND_URL}/api/user/${params.userid}/friends`, "GET", true)
    .then((res) => {
      setFriends(res.friends);
    });

  const handleSearch = () => {
    setHasSearched(true);
    request(`${BACKEND_URL}/api/user/?search_text=${query}`, "GET", false)
      .then((res) => {
        setSearchResult(res.friends);
      });
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {hasSearched && (searchResult.length > 0 ? (
        searchResult.map((result) => (
          <div key={result.user_id}>
            <p>Name: {result.user_name}</p>
            <p>Email: {result.user_email}</p>
          </div>
        ))
      ) : (
        <p>没有搜索结果</p>
      ))}
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.user_id}>
            <p>Name: {friend.user_name}</p>
            <p>Email: {friend.user_email}</p>
          </div>
        ))
      ) : (
        <p>还没有好友</p>
      )}
    </div>
  );
}
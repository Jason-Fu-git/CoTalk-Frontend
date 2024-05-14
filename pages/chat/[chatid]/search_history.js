import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';

import {BACKEND_URL} from '@/app/constants/string';
import {request} from "@/app/utils/network";
import {store} from "@/app/redux/store";
import UserCard from '@/components/UserCard';
import Image from "next/image";
import { data } from 'autoprefixer';

function timestampToBeijingTime(timestamp) {
    // 将时间戳转换为毫秒
    var date = new Date(timestamp * 1000);

    // 获取年、月、日、小时、分钟和秒
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);

    // 格式化时间
    var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedDate;
}
function Beijingdatetotimestamp(date1){
    const date=new Date(date1);
    date.setMinutes(date.getMinutes()-480);
    const timestamp1 = date.getTime();
    const timestamp2 = Math.floor(timestamp1 / 1000);
    //加一天
    const timestamp3 = timestamp2 + 86400;
    console.log(timestamp2,timestamp3);
    return [timestamp2,timestamp3];
}  
function SearchHistory() {
    const router = useRouter();
    let chatid=0;
    const [filtertime, setFilterTime] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [firstRender, setFirstRender] = useState(true);
    const [toggle, setToggle] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [members, setMembers] = useState([]);

    const updateSearch = function (search) {
        setSearchResult(oldMessages => {
            return search;
        });
    };

    const getMessageCard = function (props) {
        console.log("Making message card for: ");
        console.log(props);
        const my_id = store.getState().auth.id;

        if (props.sender_id === my_id) {
            return (
                <div style={{margin: '10px', textAlign: 'right'}}>
                    <div>
                            <span style={{fontSize: '14px', color: 'gray'}}>
							    {props.sender_name} @ {props.datetime}
						    </span>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row-reverse', margin: "10px"}}>

                        <div style={{marginRight: "20px"}}>
                            <span style={{
                                display: "inline-block",
                                background: '#90EE90',
                                padding: '10px',
                                borderRadius: '10px'
                            }}>
                                {props.message}
                                </span>
                        </div>
                    </div>
                </div>
            );
        } else if (props.sender_name === "system") {
            return (
                <div style={{textAlign: "center", margin: "10px"}}>
                    <span style={{fontSize: '14px', color: 'gray'}}>
							{props.message} @ {props.datetime}
                    </span>
                </div>
            )
        } else {
            return (
                <div style={{margin: '10px', textAlign: 'left'}}>
                    <div>
                            <span style={{fontSize: '14px', color: 'gray'}}>
							    {props.sender_name} @ {props.datetime}
						    </span>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', margin: "10px"}}>

                        <div style={{marginRight: "20px"}}>
                            <span style={{
                                display: "inline-block",
                                background: '#f6f6f6',
                                padding: '10px',
                                borderRadius: '10px'
                            }}>
                                {props.message}
                                </span>
                        </div>
                    </div>
                </div>
            );
        }
    }


    useEffect(() => {
        chatid = localStorage.getItem("chatid");
        if(router.query.chatid){
            chatid=router.query.chatid;
            localStorage.setItem("chatid", chatid);
        }
        if (firstRender) {
            setFirstRender(false);
            request(`${BACKEND_URL}/api/chat/${chatid}/members?user_id=${store.getState().auth.id}`, "GET", true)
                .then((res) => {
                    setMembers(res.members);
                });
            return;
        }
        let inputArea = document.getElementById('search-input');
        const query = inputArea.value;

        let url = `${BACKEND_URL}/api/chat/${chatid}/messages?user_id=` +
            store.getState().auth.id +
            "&filter_text=" + query;
        if (selectedUser != '') {
            url += "&filter_user=" + selectedUser;
        }
        if(filtertime!==null){
            let btime=Beijingdatetotimestamp(filtertime)[1];
            let etime=Beijingdatetotimestamp(filtertime)[0];
            url+='&filter_before='+btime+'&filter_after='+etime;
        }
        console.log("Loading search result: " + url);

        request(url, "GET", true)
            .then(async (res) => {
                const promises = res.messages.map(async function (element, index) {
                    const sender_id = element.sender_id;
                    let sender_name = "??";
                    await request(`${BACKEND_URL}/api/user/private/${sender_id}`, "GET", false)
                        .then((res) => {
                            sender_name = res.user_name;
                        });
                    const dateOptions = {hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Shanghai'};
                    const datetime = timestampToBeijingTime(element.create_time)
                    return ({
                        'index': index,
                        'sender_id': sender_id,
                        'sender_name': sender_name,
                        'message': element.msg_text,
                        'datetime': datetime,
                    });
                });
                const search = await Promise.all(promises);
                updateSearch(search)
                inputArea.value = '';
                inputArea.focus();
            });
    }, [toggle]);

    return (
        <>
            <div className="sm:w-9/12 sm:m-auto pt-16 pb-16">
                <h1 className="
                    dark:text-white text-4xl font-bold text-center"
                    style={{marginBottom: "20px"}}>
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
                <input type="date" onChange={(e) => {setFilterTime(e.target.value);console.log(timestampToBeijingTime(Beijingdatetotimestamp(filtertime)));}} />
                <div>
                    <div style={{textAlign: 'center', marginTop: '10px'}}>
                        <h5>请选择一个用户：</h5>
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
                                取消选择
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 mt-14
                            ml-8 mr-8 sm:mr-0 sm:ml-0">


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
                                    选择
                                </label>
                                <div key={member.user_id}>
                                    <UserCard {...member}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {searchResult.length > 0 && (
                    <div style={{textAlign: "center", margin: "20px"}}>
                        <h2>
                            搜索结果
                        </h2>
                    </div>

                )}

                {(searchResult.length > 0 ? (
                    searchResult.map((message) =>
                        (
                            <div key={message.index} style={{marginTop: '10px'}}>
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
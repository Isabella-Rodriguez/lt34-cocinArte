import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

export function ChatList({selectChat}){
    const [chats, setChats]= useState([])
    const [userId, setUserID]= useState()
    const [userDetails, setUserDetails] = useState({})
    const [searchInput, setSearchInput]= useState('')
    const [searchResult, setSearchResult]= useState([])

    useEffect(()=>{
        fetchChats()
    },[])

    const fetchChats= async()=>{
        const token = localStorage.getItem('token');
        const decriptedToken = jwtDecode(token)
        const userID = decriptedToken.sub
        setUserID(userID)

        const response = await fetch(process.env.BACKEND_URL +`/api/users/${userID}/chats`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        console.log(data)
        setChats(data)
        for(let chat of data){
            const otherUserId= chat.user_1_id === userID ? chat.user_2_id : chat.user_1_id;
            const userResponse = await fetch(process.env.BACKEND_URL + `/api/usuario/${otherUserId}`, {
                method: 'GET',
                headers:{ 
                    'Content-Type': 'application/json'
                }
            });
            const userData= await userResponse.json();
            console.log(userData)
            setUserDetails(prevDetails=>({...prevDetails, [otherUserId]: userData })); }
    }

    const search =async(e)=>{
        const searchTerm = e.target.value
        setSearchInput(searchTerm)

        const response = await fetch(process.env.BACKEND_URL+`/api/users/search?query=${searchTerm}`,{
            method : 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        })
        const data = await response.json()
        console.log(data)
        setSearchResult(data)
    }

    const newChat=async(user)=>{
        const token = localStorage.getItem('token')
        const decriptedToken = jwtDecode(token)
        const userId = decriptedToken.sub
        const response = await fetch(process.env.BACKEND_URL+`/api/chats`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${userId}`,
                'body': JSON.stringify({
                    'user_1_id': userId,
                    'user_2_id': user
                })
            }
        })
        const data = await response.json()
        console.log(data)
        selectChat(data.id, userName)
        setSearchInput('')
        setSearchResult([])
    }


    return (
    <>
        <div id="plist" className="people-list">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                </div>
                <input type="text" className="form-control" placeholder="Search..." value={searchInput} onChange={search}/>
            </div>
            <ul className="list-unstyled chat-list mt-2 mb-0">
                {searchResult.length>0 ? 
                    searchResult.map(user=>(
                        <li key={user.id} className="clearfix">
                        <img src={user.img_profile ? user.img_profile: null}/>
                        <div className="about">
                            <div className="name">iniciar chat con`${user.name} ${user.last_name}`</div>
                        </div>
                    </li>)):(
                    <h3>No hay usuarios encontrados</h3>
                )}
            </ul>
            <ul className="list-unstyled chat-list mt-2 mb-0">
                {chats.map(chat=>{
                    const otherUserId = chat.user_1_id===userId ? chat.user_2_id : chat.user_1_id
                    const otherUser = userDetails[otherUserId]
                    return(
                    <li key={chat.id} className="clearfix" onClick={()=>{selectChat(chat.id ,otherUser.id)}}>
                        <img src={otherUser ? otherUser.img_profile: null}/>
                        <div className="about">
                            <div className="name">Chat con {otherUser ? `${otherUser.name} ${otherUser.last_name}`: `Usuario ${otherUserId}` }</div>
                                <div className="status">
                                    <i className="fa fa-circle offline"></i>offline
                                </div>
                            </div>
                    </li>)
                })}
            </ul>
        </div>
        </>
    )
}
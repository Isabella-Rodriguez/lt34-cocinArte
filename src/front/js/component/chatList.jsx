import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { SearchIcon } from "./searchIcon.jsx";
import '../../styles/chats.css'

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
                'Authorization': `Bearer ${token}`
                },
                'body': JSON.stringify({
                    'user_1_id': userId,
                    'user_2_id': user.id
                })
            })
        const data = await response.json()
        console.log(data)
        selectChat(data.id, user.name)
        setSearchInput('')
        setSearchResult([])
    }


    return (
    <>
        <div id="plist" className="people-list border-end bg-create-recipe mt-5 p-3" style={{minHeight:'900px'}}>
        <h1 className=" create-recipe-text mx-auto p-4 mt-4">Messages</h1>
            <div className="input-group input-group-navbar pb-4"  onChange={search}>
					<input type="text" className="form-control form-cocinarte rounded bg-white bg-opacity-10 border border-0" placeholder="Search projects…" aria-label="Search" value={searchInput} onChange={search}/>
					<button className="btn bg-white bg-opacity-10 text-light" type="submit">
						<SearchIcon/>
					</button>
				</div>
            <ul className="list-unstyled chat-list mt-2 mb-0 p-2">
                {searchResult.length>0 ? 
                    searchResult.map(user=>(
                        <li key={user.id} className="d-flex p-2 rounded" onClick={()=>{newChat(user)}}>
                        <img style={{width:'40px', height:'40px'}} src={user.img_profile ? user.img_profile: null}/>
                        <div >
                            <div >iniciar chat con {user.name} {user.last_name}</div>
                        </div>
                    </li>)):null}
            </ul>
            <ul className="list-unstyled chat-list mt-2 p-2 rounded mb-0">
                {chats.map(chat=>{
                    const otherUserId = chat.user_1_id===userId ? chat.user_2_id : chat.user_1_id
                    const otherUser = userDetails[otherUserId]
                    return(
                    <li key={chat.id} className="clearfix d-flex p-2 rounded align-items-center" onClick={()=>{selectChat(chat.id ,otherUser.id)}}>
                        <img style={{width:'40px', height:'40px'}} src={otherUser ? otherUser.img_profile: null}/>
                        <div>
                            <div className="label-create-recipe px-2">Chat con {otherUser ? `${otherUser.name} ${otherUser.last_name}`: `Usuario ${otherUserId}` }</div>
                                
                            </div>
                    </li>)
                })}
            </ul>
        </div>
        </>
    )
}
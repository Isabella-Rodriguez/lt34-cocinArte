import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

export function ViewChats({chatId, otherUserId}){

    const [messages, setMessages]= useState([])
    const [newMessage, setNewMessage]= useState('')
    const [friendData, setFriendData]= useState({})
    const [userId, setUserId]=useState(null)
    useEffect(()=>{
        fetchMessages()
        fetchUserChat()
        
        const token = localStorage.getItem('token')
        const decriptedToken = jwtDecode(token)
        const userId = decriptedToken.sub
        setUserId(userId)
    },[chatId])

    const fetchUserChat=async()=>{
        const response = await fetch(process.env.BACKEND_URL + `/api/usuario/${otherUserId}`, {
                method: 'GET',
                headers:{ 
                    'Content-Type': 'application/json'
                }
            });
            const userData= await response.json();
            console.log(userData)
            setFriendData(userData)
    }

    const fetchMessages=async ()=>{
        const response = await fetch(process.env.BACKEND_URL+`/api/chats/${chatId}/messages`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log("messages",data)
        setMessages(data)

    }

    const sendMessage = async(e)=>{
        e.preventDefault();

        const response = await fetch(process.env.BACKEND_URL+`/api/chats/${chatId}/messages`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'   
            },
            body: JSON.stringify({
                sender: userId,
                content: newMessage
            })
        })
        if (response.ok){
            fetchMessages();
            setNewMessage('')
        } else{
            alert('Su mensaje no se envio!')
        }
    }
    return (
        
        <div className="chat col-9 ms-auto">
            <div className="chat-header clearfix">
                <div className="row">
                    <div className="col-lg-6">
                        <a data-toggle="modal" data-target="#view_info">
                            <img src={friendData.img_profile} alt="avatar"/>
                        </a>
                        <div className="chat-about">
                            <h5 className="m-b-0">{friendData.name}</h5>
                            <small>{friendData.last_name}</small>
                        </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right">
                        <button  className="btn btn-outline-secondary"><i className="fa fa-camera"></i></button>
                        <button  className="btn btn-outline-primary"><i className="fa fa-image"></i></button>
                        <button  className="btn btn-outline-info"><i className="fa fa-cogs"></i></button>
                        <button  className="btn btn-outline-warning"><i className="fa fa-question"></i></button>
                    </div>
                </div>
            </div>
            <div className="chat-history">
                <ul className="m-b-0">
                    {messages && messages.length>0 ? messages.map(message=>(
                        <li key={message.id} className="clearfix">
                        {message.sender===userId ? (
                            <>
                                    <div className="message-data">
                                        <span className="message-data-time">{message.date}</span>
                                    </div>
                                    <div className="message my-message">{message.content}</div>                                    
                            </>
                        ):(
                            <>
                                <div className="message-data d-flex justify-content-end text-right">
                                    <span className="message-data-time">{message.date}</span>
                                    <img src={friendData.img_profile} alt="avatar"/>
                                </div>
                                <div className="message other-message float-right">{message.content}</div>
                                </>
                            )}
                        </li>)):<></>}
                </ul>
            </div>
            <div className="chat-message clearfix">
                <form onSubmit={sendMessage}>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text" onClick={fetchMessages}>Reload</span>
                        </div>
                        <input type="text" className="form-control" placeholder="Enter text here..." value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}} />
                        <div className="input-group-prepend">
                            <button className="input-group-text" type="submit">Send</button>
                        </div>                                    
                    </div>
                </form>
            </div>
        </div>
        
    )
}
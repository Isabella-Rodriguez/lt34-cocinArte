import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export function ViewChats({chatId, otherUserId}){

    const [messages, setMessages]= useState([])
    const [newMessage, setNewMessage]= useState('')
    const [friendData, setFriendData]= useState({})
    const [userId, setUserId]=useState(null)
    const {store,actions}=useContext(Context)
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
    const formatDate=(dateString)=>{
        const options={ 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleString('es-ES', options);
    };

    return (
        
        <div className="chat mt-5 col-9 bg-create-recipe">
            <div className="chat-header border-bottom">
                <div className="row ms-3 my-3">
                    <div className="col-lg-6 d-flex align-items-center">
                        <a data-toggle="modal" data-target="#view_info">
                            <img src={friendData.img_profile} style={{width:'40px', height:'40px'}} alt="avatar"/>
                        </a>
                        <div className="chat-about label-create-recipe ms-3">
                            <h5 className="mb-0">{friendData.name}</h5>
                            <small className="mt-1">{friendData.last_name}</small>
                        </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right gap-2">
                        <button  className="btn btn-lg me-1 px-3 btn-cocinarte"><i className="fa fa-camera "></i></button>
                        <button  className="btn btn-lg me-1 px-3 btn-cocinarte"><i className="fa fa-image "></i></button>
                        <button  className="btn btn-lg me-1 px-3 btn-cocinarte"><i className="fa fa-cogs "></i></button>
                        <button  className="btn btn-lg me-1 px-3 btn-cocinarte"><i className="fa fa-question "></i></button>
                    </div>
                </div>
            </div>
            <div className="chat-history pt-3 px-3" style={{height: '82%'}}>
                <ul className="m-b-0">
                    {messages && messages.length>0 ? messages.map(message=>(
                        <>
                        {message.sender===userId ? (
                            <li key={message.id} className="d-flex flex-column">
                            <div className="float-end my-3 d-flex align-items-center justify-content-end me-3">
                                    <div className="message-data me-3 bg-cocinarte rounded p-3">
                                        <span className="message-data-time text-end label-create-recipe ">{formatDate(message.date)}</span>
                                    <div className="message my-message label-create-recipe">{message.content}</div>                                    
                                    </div>
                                    <img style={{width:'40px', height:'40px'}} src={store.user.img_profile} alt="avatar"/>
                            </div>
                            </li>
                        ):(
                            <li key={message.id} className="d-flex flex-column">
                            <div className="float-start my-3 d-flex align-items-center">
                                    <img style={{width:'40px', height:'40px'}} src={friendData.img_profile} alt="avatar"/>
                                <div className="message-data label-create-recipe ms-3 bg-cocinarte rounded p-3">
                                    <span className="message-data-time">{message.date}</span>
                                    <div className="message other-message">{message.content}</div>
                                </div>
                                </div>
                                </li>
                            )}</>
                        )):<></>
                    }
                </ul>
            </div>
            <div className="chat-message">
                <form className='mx-2' onSubmit={sendMessage}>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="btn btn-send mx-2" onClick={fetchMessages}>Reload</span>
                        </div>
                        <input type="text" className="form-control form-cocinarte rounded bg-white bg-opacity-10 border border-0" placeholder="Enter text here..." value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}} />
                        <div className="input-group-prepend">
                            <button className="btn btn-send mx-2" type="submit">Send</button>
                        </div>                                    
                    </div>
                </form>
            </div>
        </div>
        
    )
}
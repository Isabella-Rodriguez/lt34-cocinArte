import React, { useState } from "react";
import {ChatList} from "../component/chatList.jsx";
import {ViewChats} from "../component/chatView.jsx";


export function Chats(){
    const [selectedChat, setSelectedChat] = useState(null);
    const [userId, setUserID]= useState('')
    const selectChat=(chatId, otherUserId)=>{
        setSelectedChat(chatId);
        setUserID(otherUserId)
    };
    

    return(
    <div className="container">
        <div className="row clearfix">
            <div className="col-lg-12">
                <div className="card chat-app">
                    <ChatList selectChat={selectChat} />
                    {selectedChat && <ViewChats chatId={selectedChat} otherUserId={userId} />}
                </div>
            </div>
        </div>
    </div>
    )
}
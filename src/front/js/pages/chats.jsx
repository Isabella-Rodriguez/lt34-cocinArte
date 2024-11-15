import React, { useContext, useState } from "react";
import {ChatList} from "../component/chatList.jsx";
import {ViewChats} from "../component/chatView.jsx";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import { Context } from "../store/appContext.js";


export function Chats(){
    const [selectedChat, setSelectedChat] = useState(null);
    const [userId, setUserID]= useState('')
    const selectChat=(chatId, otherUserId)=>{
        setSelectedChat(chatId);
        setUserID(otherUserId)
    };
    const {store, actions}=useContext(Context)

    return(
        <div className="bg-cocinarte">
        <div  className=" vh-100 w-100">
            <Navbar/>
            <div className={` d-flex container-fluid mx-auto rounded col-11 ${store.sideBar===false ? 'sidebar-close':'sidebar-open'}`}>
                <ChatList selectChat={selectChat} />
                {selectedChat && <ViewChats chatId={selectedChat} otherUserId={userId} />}
            </div>
</div>
            <div className="d-block">
            <Footer/>

            </div>
    </div>
    )
}
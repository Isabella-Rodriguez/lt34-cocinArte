import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/navBar.css'
import { SearchIcon } from "./searchIcon.jsx";
import { faBars, faStar, faSquarePlus, faComments, faArrowRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "../store/appContext.js";
import { Sidebar } from "./sidebar.jsx";
import { jwtDecode } from "jwt-decode";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import { Footer } from "./footer.js";


export const Navbar = () => {
	const [isLogin, setIsLogin]=useState(false)
	const [search, setSearch] = useState("")
	const navigate = useNavigate()
	const {store, actions}=useContext(Context)
	const [chats, setChats]=useState([])
	const [userDetails, setUserDetails] = useState({})
	const [userId, setUserId]=useState('')

	useEffect(()=>{
		const token =localStorage.getItem('token')
		if(token){
			setIsLogin(true)
			const decodeToken= jwtDecode(token)
			setUserId(decodeToken.sub)
			actions.userById(decodeToken.sub)
			console.log(store.user)
			mostrarChats(decodeToken.sub, token)
		} else{ setIsLogin(false)}

	},[localStorage.getItem('token')])
	const logOut = ()=>{
		localStorage.removeItem('token');
		setIsLogin(false);
		console.log("Se cerro la sesion")
		navigate('/login/cocinero')
	}
	const searchTitle=(e)=>{
		e.preventDefault();
		navigate(`/search?query=${search}`);
	}
	const mostrarSidebar=()=>{
		actions.setSidebar()
	}
	
	const mostrarChats=async(userID, token)=>{
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

	return (
		<>
			<Sidebar/>
			<div className={`d-flex col-12 bg-sidebar-dashboard nav-cocinarte align-items-center py-4 ${store.sideBar===false ? '':'sidebar'}`}>
				<a className="sidebar-toggle ps-3" onClick={mostrarSidebar}>
                <FontAwesomeIcon className="cocinarte-text fs-3" icon={faBars} />
                </a>
			<div className="container-fluid d-flex justify-content-around ">
				<div className="d-flex align-items-center col-3">
				<form className="input-group input-group-navbar ms-2" onSubmit={searchTitle}>
					<input type="text" className="form-control form-cocinarte bg-white bg-opacity-10 border border-0" placeholder="Search projects…" aria-label="Search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
					<button className="btn bg-white bg-opacity-10 text-light" type="submit">
						<SearchIcon/>
					</button>
				</form>
				</div>
					<div>
					</div>
					<div className="d-flex align-items-center">
						{(isLogin) ? <>
							<li className="nav-item dropdown">
								<a className="nav-icon dropdown-toggle d-inline-block d-sm-none cocinarte-text" href="#" data-bs-toggle="dropdown">
									<svg xmlns="http://www.w3.org/2000/svg" width={"24"} height={"24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings align-middle"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
								</a>
								<a className="nav-link dropdown-toggle cocinarte-text text-decoration-none d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown" aria-expanded="false">
								<FontAwesomeIcon className="cocinarte-text" style={{fontSize:'25px'}}icon={faComments} />
								
								</a>
								<div className="dropdown-menu dropdown-menu-cocinarte dropdown-menu-end shadow-detail-nav" style={{width:'280px'}}>
								{chats.length>0 ? chats.map(chat=>{
											const otherUserId = chat.user_1_id===userId ? chat.user_2_id : chat.user_1_id
											const otherUser = userDetails[otherUserId]
											return(
												<a key={chat.id} href="#" className="list-group-item chats-cocinarte-nav">
													<div className="row g-0  align-items-center">
														<div className="col-2">
															<img src={otherUser ? otherUser.img_profile: null} className="img-fluid rounded-circle" alt="" width={"40"} height={"40"}/>
														</div>
														<div className="col-9  ms-2  ps-2">
															<div className=" text-decoration-none">{otherUser ? `${otherUser.name} ${otherUser.last_name}`:null }</div>
															<div className="small mt-1" onClick={()=>{navigate('/chats')}}>Ver mensajes</div>
														</div>
													</div>
												</a>)
                							}):(
												<div className="list-group-item chats-cocinarte-nav text-center" onClick={()=>{navigate('/chats')}}>Ver mensajes</div>
											)
											}
								</div>
							</li>
							<Link className="mx-2" to={"/recipe/create"} ><button className="btn btn-cocinarte">Postear Receta</button></Link>
							<li className="nav-item dropdown d-flex">
							<a className="nav-icon dropdown-toggle d-inline-block d-sm-none cocinarte-text" href="#" data-bs-toggle="dropdown">
								<svg xmlns="http://www.w3.org/2000/svg" width={"24"} height={"24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings align-middle"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
							</a>
							{store.user.img_profile ? (
									<div className="round-container-nav">
										<img
											src={store.user.img_profile}
											alt="Customer Support"
										/>
									</div>
								) : (
									<div className="user-icon-nav">
										<FontAwesomeIcon icon={faUser} />
									</div>
								)}
							<a className="px-2 nav-link dropdown-toggle cocinarte-text text-decoration-none d-none d-sm-inline-block align-items-center" href="#" data-bs-toggle="dropdown" aria-expanded="false">	
								<span>{store.user.name} {store.user.last_name}</span>
							</a>
							<div className="dropdown-menu dropdown-menu-cocinarte shadow-detail-nav dropdown-menu-end">
								<a className="dropdown-item  chats-cocinarte-nav opacity-100 fs-5" href="#" onClick={()=>{navigate('/favoritos')}}>
									<span><FontAwesomeIcon className="chats-cocinarte-nav" icon={faStar} style={{color:'#adb5bd'}} /></span>
									<span className="ms-2">Favoritos</span>
								</a>
								<a className="dropdown-item  chats-cocinarte-nav opacity-100 fs-5" href="#" onClick={()=>{navigate('/mis-recetas')}}>
									<span><FontAwesomeIcon className="chats-cocinarte-nav" icon={faSquarePlus} /></span>
									<span className="ms-2">Mis recetas</span>
								</a>
								<div className="dropdown-divider"></div>
								<a className="dropdown-item opacity-100 chats-cocinarte-nav fs-5" href="#" onClick={logOut}>
									<span><FontAwesomeIcon className="chats-cocinarte-nav" icon={faArrowRightFromBracket} /></span>
									<span className="ms-2">Cerrar sesion</span>
								</a>
							</div>
							</li>
						</> : 
							(<>
							<Link to="/login/cocinero">
							<button className="btn btn-actions me-3" >Login Cocinero</button>
							</Link>
							<Link to="/login/administrador">
							<button className="btn btn-actions" >Login Admin</button>
			   				</Link>
							</>)
						}
					</div>
				</div>
				
			</div>
				
		</>
	);
};

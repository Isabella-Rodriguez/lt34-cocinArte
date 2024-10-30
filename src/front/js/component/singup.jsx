import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function CreateUser(){
    const [name, setName]=useState("")
    const [lastName, setLastName]=useState("")
    const [email, setEmail] =useState("")
    const [password, setPassword] =useState("")
    const [file, setFile] =useState(null)
    const navigate = useNavigate()

    const fileToSend =(e)=>{
        setFile(e.target.files[0])
    }

    const createUser = async(e)=>{
        e.preventDefault()
        const formData = new FormData()
        
        formData.append('name', name)
        formData.append('last_name', lastName)
        formData.append('email', email)
        formData.append('password', password)
        if (file){
            formData.append('file', file)
        }
        const response = await fetch(process.env.BACKEND_URL + '/api/usuario',{
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            const user = await response.json();
            console.log('User created:', user);
            navigate('/')
        } else {
            const errorMessage = await response.text();
            console.log('Create user failed:', errorMessage);
        }
        
    }

    return (<div className='d-flex flex-column align-items-center gap-2 mt-5'>
        <h1>Conviertete en cocinero!</h1>
        <form className='d-flex flex-column align-items-center gap-2' onSubmit={createUser}>
            <label className="form-label" htmlFor="name">Nombre cocinero:</label>
            <input className="form-control" type="text" placeholder="Name" id='name' value={name} onChange={(e)=>setName(e.target.value)}/>
            <label className="form-label" htmlFor="lastName">Apellido cocinero:</label>
            <input className="form-control" type="text" placeholder="Last Name" id='lastName' value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            <label className="form-label" htmlFor="email">Email cocinero:</label>
            <input className="form-control" type="email" id='email' placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <label className="form-label" htmlFor="password">Contraseña cocinero:</label>
            <input className="form-control" type="password" id='password' placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <label className="form-label" htmlFor="img">Foto cocinero:</label>
            <input type="file" id='img' onChange={(e)=>{fileToSend(e)}} />
            <button className='btn btn-success col-5' type="submit">Crear Cocinero</button>
            <Link to={'/'} className='btn btn-secondary col-5'>Cancelar</Link>
        </form>
        </div>
    );
}
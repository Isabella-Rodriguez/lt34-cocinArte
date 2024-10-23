import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export function LoginCocinero(){
    const navigate = useNavigate()
    const login=async(e)=>{
        e.preventDefault()
        e.persist()
        const dataSend={
            'email':e.target.email.value,
            'password':e.target.password.value
        }
        const resp = await fetch(process.env.BACKEND_URL + '/api/usuario/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataSend)
        })
        if(resp.ok){
            const data = await resp.json()
            console.log(('Te has logueado'), data);
            localStorage.setItem('token', true)//configurar JWT
            console.log('token guardado en LocalStorage')
            navigate('/')
        } else console.log('No has podido loguearte, revisa tus credenciales');
    }

    return (
    <h1 className="container d-flex flex-column justify-content-center">
        <h1 className="container">Login!</h1>
        <form className="container d-flex flex-column" action="" onSubmit={(e)=>{login(e)}}>
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-control" type="text" name="email" id="email" placeholder="Enter your email"/>
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-control" type="password" name="password" id="password" placeholder="Enter your password"/>
            <button className="btn btn-primary">Login!</button>
        </form>
    </h1>)
}
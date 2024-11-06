import React,{ useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Favoritos = () => {
	const { store, actions } = useContext(Context);
	const [recipes, setRecipes] = useState([])
	
	useEffect(()=>{
		actions.loadFavs()},
		[]) 
	
	useEffect(()=>{const fetchRecipes=async()=>{
		const recipeDetails=await Promise.all(store.favoritos.map(async (favorito)=>{
			const response=await fetch(`${process.env.BACKEND_URL}/api/recetas/${favorito.recipe_id}`);
			const data =await response.json()
			return {...favorito, recipe:data}})
		);
		setRecipes(recipeDetails)};
		if(store.favoritos.length>0){
			fetchRecipes();}},
			[store.favoritos]);

	return(
		<div className="text-center mt-5 d-flex flex-column">
			<h1>Favoritos!</h1>
			<div className="d-flex justify-content-center col flex-column">
			{recipes && recipes.length>0 ? (
				recipes.map((favorito, index)=>(
					<div key={index} className="m-1 rounded w-75 p-3 border border-info row d-flex align-items-center col mx-auto">
						<div className="col">
							<h3>Receta:{favorito.recipe.title}</h3>
						</div>
						<div className="col p-auto">
							<button type="button" className="btn btn-danger" onClick={()=>actions.deleteFav(index)}>Eliminar</button>
						</div>
					</div>))) : (
						<p>No hay favoritos para mostrar.</p>
					)
					}
			</div>
		</div>
	);
	
};
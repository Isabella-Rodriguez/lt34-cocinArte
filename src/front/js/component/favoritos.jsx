import React,{ useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Favoritos = () => {
	const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.loadFavs()
      },[]);

	return(
		<div className="text-center mt-5">
			<h1>Favorios! </h1>
			
			<div className="d-flex justify-content-center col flex-column">
				{store.favoritos.map((favorito, index) => (
					<div key={index} className="m-1 rounded w-75 p-3 border border-info row d-flex align-items-center col mx-auto">
						
						<div className="col">
							<h3>Id receta: {favorito.recipe_id} </h3>
						</div>

						<div className="col p-auto">
							<button type="button" class="btn btn-danger" onClick={()=>actions.deleteFav(index)}>Eliminar</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
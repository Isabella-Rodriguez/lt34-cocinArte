const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			users:[]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			loadUsers: () => {
				fetch(process.env.BACKEND_URL + '/api/usuario')
        		.then(response => response.json())
        		.then(data => {
					console.log(data);
					const store = getStore();
					setStore({users:data})
					console.log(store.users)
				});
			},

			addUser: (newUserData) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( 
						newUserData
					   )
				};
				fetch(process.env.BACKEND_URL + '/api/usuario', requestOptions)
					.then(response => response.json())
					.then(data => console.log("Usuario añadido"));
			},

			deleteUser: (index) => {
				const store = getStore(); 
				let idToDelete = store.users[index].id;
				console.log("Se borrara: " + idToDelete)
				setStore({users : store.users.filter( (usuarios,indx)=>indx!=index) });
					
				fetch(process.env.BACKEND_URL + '/api/usuario/' + idToDelete, { method: 'DELETE' })
					.then(response => console.log("Se borro " + idToDelete));
					
			},

			modUser: (userModif,id) => {
				
				console.log("id a modiifcar : " + id)
				const requestOptions = {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( 
						userModif
					   )
				};
				fetch(process.env.BACKEND_URL + '/api/usuario/' + id, requestOptions)
					.then(response => response.json())
					.then(data => console.log("Usuario modificado"));
			},

		}
	};
};

export default getState;

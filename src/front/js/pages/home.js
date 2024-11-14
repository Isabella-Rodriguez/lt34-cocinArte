import React, { useEffect, useState } from "react";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
	const [loading, setLoading]=useState(false);
	const [recipesRand, setRecipesRand]=useState([]);
	const navigate = useNavigate()

	useEffect(()=>{
		recipes_external()
	},[])

    const toRecipesApi=()=>{
        navigate(`/recipe/api/${recipe.id}`)
    }

	const recipes_external = ()=>{
		setLoading(true);
        const APIkey = '9c5e9cf7930840e5acd2b5edc06177e0'
		fetch(`https://api.spoonacular.com/recipes/random?number=3&apiKey=${APIkey}`,{
			method:'GET',
			headers: { 'Content-Type': 'application/json' }
		}).then(response=>response.json())
		.then(data=>{setRecipesRand(data.recipes || []); console.log(data.recipes)})
		.finally(() => setLoading(false))
	}

	return (
        <body className="index-page w-100">

        <header id="header" className="header fixed-top">
            <div className="branding d-flex align-items-cente">

            <div className="container position-relative d-flex align-items-center justify-content-between">
                <a href="index.html" className="logo d-flex align-items-center me-auto me-xl-0">
                <h1 className="sitename">CocinArte</h1>
                </a>

                <nav id="navmenu" className="navmenu">
                <ul>
                    <li><a href="#hero">Inicio<br/></a></li>
                    <li><a href="#why-us">Nosotros</a></li>
                    <li><a href="#galeria">Galeria</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
                <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                </nav>
                <Link className="mx-2" to={"/singup"} ><a className="btn-book-a-table d-none d-xl-block" >Registrate!</a></Link>
                

            </div>

            </div>

        </header>

        <main className="main">

            <section id="hero" className="hero section dark-background">

                <img src="https://img.hellofresh.com/w_3840,q_auto,f_auto,c_fill,fl_lossy/hellofresh_s3/image/HF_Y24_R07_W23_ES_ESCLCC22014-2_Main_high-58f8ea9c.jpg" alt="" data-aos="fade-in"/>

                <div className="container">
                    <div className="row">
                    <div className="col-lg-8 d-flex flex-column align-items-center align-items-lg-start">
                        <h2 data-aos="fade-up" data-aos-delay="100">Bienvenido a <span>CocinArte</span></h2>
                        <p data-aos="fade-up" data-aos-delay="200">El lugar de tus recetas!</p>
                        <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay="300">
                        <Link className="mx-2" to={"/singup"} ><a className="cta-btn">Registrate!</a></Link>
                        <Link className="mx-2" to={"/login/cocinero"} ><a className="cta-btn">Inicia sesión!</a></Link>
                        </div>
                    </div>
                    
                    </div>
                </div>

            </section>
            
            <section id="why-us" className="why-us section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>Nosotros</h2>
                    <p></p>
                </div>
                <div className="container">
                    <div className="row gy-4">

                    <div className="col-lg-3" data-aos="fade-up" data-aos-delay="100">
                        <div className="card-item">
                        <span>01</span>
                        <h4><a href="" className="stretched-link">Explora y comparte recetas</a></h4>
                        <p>Ulamco laboris nisi ut aliquip ex ea commodo consequat. Et consectetur ducimus vero placeat</p>
                        </div>
                    </div>

                    <div className="col-lg-3" data-aos="fade-up" data-aos-delay="200">
                        <div className="card-item">
                        <span>02</span>
                        <h4><a href="" className="stretched-link">Encuentra inspiración culinaria</a></h4>
                        <p>Dolorem est fugiat occaecati voluptate velit esse. Dicta veritatis dolor quod et vel dire leno para dest</p>
                        </div>
                    </div>

                    <div className="col-lg-3" data-aos="fade-up" data-aos-delay="300">
                        <div className="card-item">
                        <span>03</span>
                        <h4><a href="" className="stretched-link">Forma parte de una gran comunidad</a></h4>
                        <p>Molestiae officiis omnis illo asperiores. Aut doloribus vitae sunt debitis quo vel nam quis</p>
                        </div>
                    </div>

                    <div className="col-lg-3" data-aos="fade-up" data-aos-delay="300">
                        <div className="card-item">
                        <span>04</span>
                        <h4><a href="" className="stretched-link">Elije tus favoritas y amplia tu recetario</a></h4>
                        <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            <section id="galeria" className="section text-white">
                <div className="container section-title d-flex justify-content-start" data-aos="fade-up">
                    <h2>Galeria</h2>
                    <p></p>
                </div>
                <div className="container">
                    

                    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></li>
                        <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
                        <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner">
                        {recipesRand.length > 0 ? recipesRand.map((recipe, index) => (
                        <div
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                            key={recipe.id}
                            style={{ backgroundColor: '#0c0b09' }}
                        >
                            <div className="row align-items-center item-content">
                            {/* Columna de la imagen (1/3 del espacio) */}
                            <div className="col-md-4">
                                <img src={recipe.image} className="d-block w-100 rounded" alt={recipe.title} />
                            </div>

                            {/* Columna del texto (2/3 del espacio) */}
                            <div className="col-md-8 text-start">
                                <h5 className="item-title">{recipe.title}</h5>
                                <h6 className="text-white">{recipe.creditsText}</h6>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                            </div>
                        </div>
                        )) : (
                        <h1 className="container text-center text-danger">Error al cargar recetas.</h1>
                        )}
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                    </div>
                </div>
            </section>
        </main>
    </body>
    )
}
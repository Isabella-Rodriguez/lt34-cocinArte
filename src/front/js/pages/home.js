import React, { useEffect, useState } from "react";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";


export const Home = () => {
	const [loading, setLoading]=useState(false);
	const [recipesRand, setRecipesRand]=useState([]);
	const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false);
    const [hideTopbar, setHideTopbar] = useState(false);

    const testimonials = [
          {
            quote: "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.",
            name: "Sara Wilsson",
            title: "Designer",
            img: "https://plus.unsplash.com/premium_photo-1669879825881-6d4e4bde67d5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
          },
          {
            quote: "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore labore illum veniam.",
            name: "John Larson",
            title: "Entrepreneur",
            img: "https://cdn-icons-png.flaticon.com/512/1361/1361765.png",
          },
          {
            quote: "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam duis minim tempor labore quem eram duis noster aute amet eram fore quis sint minim.",
            name: "Jena Karlis",
            title: "Store Owner",
            img: "https://cdn-icons-png.flaticon.com/512/1361/1361765.png",
          },
        ];
  
    useEffect(() => {  
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setScrolled(scrollPosition > 50);
        setHideTopbar(scrollPosition > 100);
      };
      recipes_external()
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
      
    }, []);

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
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        rel="stylesheet"
        />
        <header id="header" className={`header fixed-top ${scrolled ? 'scrolled' : ''}`}>
            <div className={`topbar d-flex align-items-center ${hideTopbar ? 'hide' : ''}`}>
                <div className="container d-flex justify-content-center justify-content-md-between">
                <div className="contact-info d-flex align-items-center">
                    <i className="bi bi-envelope d-flex align-items-center">
                    <a href="/cdn-cgi/l/email-protection#3a5955544e5b594e7a5f425b574a565f14595557">
                        <span className="__cf_email__">[email&#160;protected]</span>
                    </a>
                    </i>
                    <i className="bi bi-phone d-flex align-items-center ms-4">
                    <span>+1 5589 55488 55</span>
                    </i>
                </div>
                <div className="languages d-none d-md-flex align-items-center">
                    <ul>
                    <li>En</li>
                    <li><a href="#">De</a></li>
                    </ul>
                </div>
                </div>
            </div>

            <div className={`branding d-flex align-items-center ${hideTopbar ? 'shift-up' : ''}`}>
                <div className="container position-relative d-flex align-items-center justify-content-between">
                    <a href="index.html" className="logo d-flex align-items-center me-auto me-xl-0">
                    <h1 className="sitename">CocinArte</h1>
                    </a>
                    <nav id="navmenu" className={`navmenu ${scrolled ? 'scrolled' : ''}`}>
                        <ul>
                            <li><a href="#hero">Inicio<br/></a></li>
                            <li><a href="#why-us">Nosotros</a></li>
                            <li><a href="#galeria">Galeria</a></li>
                            <li><a href="#testimonials">Testimonios</a></li>
                            <li><a href="#chefs">Equipo</a></li>

                        </ul>
                        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                    </nav>
                    <Link className="mx-2" to={"/signup"}>
                    <a className="btn-book-a-table d-none d-xl-block">Regístrate!</a>
                    </Link>
                </div>
            </div>
            </header>

        <main className="main">

            <section id="hero" className="hero section dark-background">

                <img src="https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2020/04/02/15858143827535.jpg" alt="" data-aos="fade-in"/>

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
                            <div className="col-md-4">
                                <img src={recipe.image} className="d-block w-100 rounded" alt={recipe.title} />
                            </div>

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

            <section id="testimonials" className="testimonials section pb-0">
                <div className="container section-title">
                    <h2>Testimonios</h2>
                    <p></p>
                </div>
                <div className="container my-3">
                    <div
                    id="testimonialsCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    >
                    <div className="carousel-inner">
                        {testimonials.map((testimonial, index) => (
                        <div
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                            key={index}
                        >
                            <div className="testimonial-item">
                            <p>
                                <i className="bi bi-quote quote-icon-left"></i>
                                {testimonial.quote}
                                <i className="bi bi-quote quote-icon-right"></i>
                            </p>
                            <img
                                src={testimonial.img}
                                className="testimonial-img"
                                alt={`${testimonial.name}'s avatar`}
                            />
                            <h3>{testimonial.name}</h3>
                            <h4>{testimonial.title}</h4>
                            </div>
                        </div>
                        ))}
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#testimonialsCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#testimonialsCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    </div>
                </div>
                </section>

                <section id="chefs" className="chefs section">

                    <div className="container section-title" data-aos="fade-up">
                        <h2>Nuestro Equipo</h2>
                        <p></p>
                        <div className="container mt-5">
                            <div className="row gy-4">

                                <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                                <div className="member">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1361/1361765.png" className="img-fluid" alt=""/>
                                    <div className="member-info">
                                    <div className="member-info-content">
                                        <h4>Facundo Rodríguez</h4>
                                        <span>Web Developer</span>
                                    </div>
                                    <div className="social">
                                        <a href=""><i className="bi bi-twitter-x"></i></a>
                                        <a href=""><i className="bi bi-facebook"></i></a>
                                        <a href=""><i className="bi bi-instagram"></i></a>
                                        <a href=""><i className="bi bi-linkedin"></i></a>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
                                <div className="member">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1361/1361765.png" className="img-fluid" alt=""/>
                                    <div className="member-info">
                                    <div className="member-info-content">
                                        <h4>Isabela Rodríguez</h4>
                                        <span>Web Developer</span>
                                    </div>
                                    <div className="social">
                                        <a href=""><i className="bi bi-twitter-x"></i></a>
                                        <a href=""><i className="bi bi-facebook"></i></a>
                                        <a href=""><i className="bi bi-instagram"></i></a>
                                        <a href=""><i className="bi bi-linkedin"></i></a>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
                                <div className="member">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1361/1361765.png" className="img-fluid" alt=""/>
                                    <div className="member-info">
                                    <div className="member-info-content">
                                        <h4>Diego Barajas</h4>
                                        <span>Web Developer</span>
                                    </div>
                                    <div className="social">
                                        <a href=""><i className="bi bi-twitter-x"></i></a>
                                        <a href=""><i className="bi bi-facebook"></i></a>
                                        <a href=""><i className="bi bi-instagram"></i></a>
                                        <a href=""><i className="bi bi-linkedin"></i></a>
                                    </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    </div>
                </div>

            </section>
        </main>
        <footer id="footer" className="footer">
            <div className="container footer-top">
            <div className="row gy-4">
                <div className="col-lg-6 col-md-6 footer-about">
                <a href="index.html" className="logo d-flex align-items-center">
                    <span className="sitename">CocinArte</span>
                </a>
                <div className="footer-contact pt-3">
                    <p>A108 Adam Street</p>
                    <p>New York, NY 535022</p>
                    <p className="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
                    <p><strong>Email:</strong> <span><a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="2c45424a436c49544d415c4049024f4341">[email&#160;protected]</a></span></p>
                </div>
                    <div className="social-links d-flex mt-4">
                        <a href=""><i className="bi bi-twitter-x"></i></a>
                        <a href=""><i className="bi bi-facebook"></i></a>
                        <a href=""><i className="bi bi-instagram"></i></a>
                        <a href=""><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>

                <div className="col-lg-3 col-md-3 footer-links">
                <h4>Enlaces Útiles</h4>
                    <ul>
                        <li><a href="#hero">Inicio<br/></a></li>
                        <li><a href="#why-us">Nosotros</a></li>
                        <li><a href="#galeria">Galeria</a></li>
                        <li><a href="#testimonials">Testimonios</a></li>
                        <li><a href="#chefs">Equipo</a></li>
                        <li><Link to={"/singup"} ><a c>Registro</a></Link></li>
                        <li><Link to={"/login/cocinero"} ><a >Iniciar sesión</a></Link></li>
                    </ul>
                </div>

                <div className="col-lg-3 col-md-3 footer-links">
                    <h4>Servicios</h4>
                    <ul>
                        <li><a href="#">Web Design</a></li>
                        <li><a href="#">Web Development</a></li>
                        <li><a href="#">Product Management</a></li>
                        <li><a href="#">Marketing</a></li>
                        <li><a href="#">Graphic Design</a></li>
                    </ul>
                </div>
            </div>
            </div>

            <div className="container copyright text-center mt-4">
                <p>© <span>Copyright</span> <strong className="px-1 sitename">CocinArte</strong> <span>Todos los derechos reservados</span></p>
                <div className="credits">
                    Designed by <a href="#chefs">CocinArte Team</a>
                </div>
            </div>

        </footer>
    </body>
    )
}
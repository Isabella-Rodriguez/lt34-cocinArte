import React, { Component } from "react";
import '../../styles/footer.css'
import { GitHubIcon } from "./gitHubIcon.jsx";

export const Footer = () => (
	<footer className="footer mt-5 p-3 bg-cocinarte text-center position-relative bottom-0">
		<div className="d-flex justify-content-center w-auto ms-5">
			<h3 className="cocinarte-text fs-1 mx-5 my-auto">CocinArte</h3>
			<div className="vr text-white"></div>
			<div className="text-start ps-5">
				<h4 className="cocinarte-text d-flex">Contactenos</h4>
				<ul>
					<li>
						<GitHubIcon/>
						<a href="https://github.com/DiegoCruzzz" className="ms-2 text-decoration-none cocinarte-text" >Diego Barajas</a>
					</li>
					<li>
						<GitHubIcon/>
						<a href="https://github.com/Isabella-Rodriguez" className="ms-2 text-decoration-none cocinarte-text">Isabella Rodríguez</a>
					</li>
					<li>
						<GitHubIcon/>
						<a href="https://github.com/Dfacundorod" className="ms-2 text-decoration-none cocinarte-text ">Facundo Rodriguez</a>
					</li>
				</ul>
			</div>
		</div>
	</footer>
);

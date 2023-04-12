import React from "react";
import { NavLink } from "react-router-dom";

import "./styles/pages.scss";
export default function Error() {
    return (
        <main>
            <div className="container">
                <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                    <h1>404</h1>
                    <h2>The page you are looking for doesn't exist.</h2>
                    <NavLink to={"/home"} className="nav-link scrollto">
                        <span>Back to Home</span>
                    </NavLink>
                    <img
                        src="assets/img/not-found.svg"
                        className="img-fluid py-5"
                        alt="Page Not Found"
                    />
                </section>
            </div>
        </main>
    );
}

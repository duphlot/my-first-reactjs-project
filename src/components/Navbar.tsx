import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './css/App.css'
interface NavbarProps {
    text: string;
}

function Navbar({ text }: NavbarProps) {
    return (
    <>
    <nav className="navbar navbar-expand-lg" >
            <div className="navbar-collapse" id="navbarNav" >
                <ul className="navbar-nav marquee-navbar">
                    <a className="navbar-brand" >
                        <img src="images/logo/logoNavbar.png" alt="Logo" className="navbar-logo" />
                    </a>
                    <a className="nav-link">
                        <div className="marquee-container d-flex">
                            <div className="marquee-text">
                            {[...Array(100)].map((_, index) => (
                                <span key={index}>{text}</span>
                            ))}
                            </div>
                        </div>
                    </a>
                </ul>
            </div>
        </nav>
    </>
  )
}

export default Navbar
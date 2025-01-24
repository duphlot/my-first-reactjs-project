import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import BeadProducts from "./Products/BeadProducts";
import BakeProducts from "./Products/BakeProducts";
import CustomProducts from "./Products/CustomProducts";
import Checkout from "./Products/Checkout";
import Home from './home';

// css
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'font-awesome/css/font-awesome.min.css'
import './css/App.css'
import './css/animation.css'
import './css/block.css'
import './css/carousel.css'
import './css/checkout.css'
import './css/custom.css'
import './css/newProducts.css'
import './css/product-details.css'
import './css/products.css'
import './css/slick.css'

//js
import 'bootstrap/dist/js/bootstrap.min.js'
import 'jquery/dist/jquery.min.js'
import 'slick-carousel/slick/slick.min.js'
import App from './../App';
import ProductsDetails from "./Products/productsDetails";

const MainBar: React.FC = () => {
    const sections = ["home", "bead", "bake", "custom", "checkout"];
    const sectionColors = ["#FFF6E3", "#f7dbf2", "#ded7fb", "#e4f5ff", "#eaf9eb"];
    const location = useLocation();

    const HideDetailsSection = () => {
        document.querySelectorAll('.side-section').forEach((section) => {
            (section as HTMLElement).style.display = 'none';
        });
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const highlight = document.createElement("div");
            highlight.className = "click-highlight";
            highlight.style.left = `${e.pageX - 10}px`;
            highlight.style.top = `${e.pageY - 10}px`;
            document.body.appendChild(highlight);
            setTimeout(() => highlight.remove(), 500);
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        const sectionId = location.pathname.split("/")[1];
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.style.display = "block";
            setTimeout(() => {
                activeSection.classList.add('slide-in');
            }, 50);
        }
    }, [location]);

    return (
        <div className="main-container">
            {/* Navigation */}
            <ul className="navbar-nav navigate under">
                {sections.map((section, index) => (
                    <li key={section} className={`nav-item custom-nav-item ${location.pathname.includes(section) ? "active shadow-active" : ""}`}>
                        <Link
                            onClick={HideDetailsSection}
                            
                            className="nav-link"
                            to={`/${section}`}
                        >
                            {section}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Content Sections */}
            <Routes>
                <Route path="/home" element={<Home style={{ backgroundColor: sectionColors[sections.indexOf("home")] }} />} />
                <Route path="/bead" element={<BeadProducts style={{ backgroundColor: sectionColors[sections.indexOf("bead")] }} />} />
                <Route path="/productDetails" element={<ProductsDetails />} />
                <Route path="/bake" element={<BakeProducts style={{ backgroundColor: sectionColors[sections.indexOf("bake")] }} />} />
                <Route path="/custom" element={<CustomProducts style={{ backgroundColor: sectionColors[sections.indexOf("custom")] }} />} />
                <Route path="/checkout" element={<Checkout style={{ backgroundColor: sectionColors[sections.indexOf("checkout")] }} />} />
                
            </Routes>
        </div>
    );
};

export default MainBar;

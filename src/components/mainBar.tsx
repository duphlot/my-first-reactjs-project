import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import BeadProducts from "./Products/BeadProducts";
import BakeProducts from "./Products/BakeProducts";
import CustomProducts from "./Products/CustomProducts";
import Checkout from "./Products/Checkout";
import Home from './home';

const MainBar: React.FC = () => {
    const sections = ["home", "bead", "bake", "custom", "checkout"];
    const sectionColors = ["#FFF6E3", "#f7dbf2", "#ded7fb", "#e4f5ff", "#d3f4d4"];
    const location = useLocation();

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

    return (
        <div className="main-container">
            {/* Navigation */}
            <ul className="navbar-nav navigate under">
                {sections.map((section, index) => (
                    <li key={section} className={`nav-item custom-nav-item ${location.pathname.includes(section) ? "active shadow-active" : ""}`}>
                        <Link
                            className="nav-link"
                            to={`/${section}`}
                            style={{ backgroundColor: location.pathname.includes(section) ? sectionColors[index] : "" }}
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
                <Route path="/bake" element={<BakeProducts style={{ backgroundColor: sectionColors[sections.indexOf("bake")] }} />} />
                <Route path="/custom" element={<CustomProducts style={{ backgroundColor: sectionColors[sections.indexOf("custom")] }} />} />
                <Route path="/checkout" element={<Checkout style={{ backgroundColor: sectionColors[sections.indexOf("checkout")] }} />} />
            </Routes>
        </div>
    );
};

const App: React.FC = () => (
    <Router>
        <MainBar />
    </Router>
);

export default App;

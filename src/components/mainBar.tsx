import React, { useState, useEffect } from "react";
import BeadProducts from "./Products/BeadProducts";
import BakeProducts from "./Products/BakeProducts";
import CustomProducts from "./Products/CustomProducts";
import Checkout from "./Products/Checkout";
import Home from './home';

const MainBar: React.FC = () => {
    const [activeSection, setActiveSection] = useState("home");
    const sections = ["home", "bead", "bake", "custom", "checkout"];

    const sectionColors = ["#FFF6E3", "#f7dbf2", "#ded7fb", "#e4f5ff", "#d3f4d4"];

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
    };

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

    // Xác định index của active section để tìm màu nền thích hợp
    const activeIndex = sections.indexOf(activeSection);
    const activeColor = sectionColors[activeIndex] || "white";

    return (
        <>
            <div className="main-container">
                {/* Navigation */}
                <ul className="navbar-nav navigate under">
                    {sections.map((section, index) => (
                        <li key={section} className={`nav-item custom-nav-item ${activeSection === section ? "active shadow-active" : ""}`}>
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleSectionChange(section)}
                                style={{ backgroundColor: activeSection === section ? sectionColors[index] : "" }}
                            >
                                {section}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Content Sections */}
                {activeSection === "home" && <Home  style={{ backgroundColor: activeColor }}/>}
                {activeSection === "bead" && <BeadProducts  style={{ backgroundColor: activeColor }}/>}
                {activeSection === "bake" && <BakeProducts  style={{ backgroundColor: activeColor }}/>}
                {activeSection === "custom" && <CustomProducts  style={{ backgroundColor: activeColor }}/>}
                {activeSection === "checkout" && <Checkout  style={{ backgroundColor: activeColor }}/>}
            </div>
        </>
    );
};

export default MainBar;

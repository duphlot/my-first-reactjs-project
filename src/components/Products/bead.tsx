import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import ProductsDetails from "./productsDetails";
import BeadProducts from "./BeadProducts";
import { update } from "firebase/database";
import exp from "constants";
import { createRoot } from 'react-dom/client';
interface BeadProps {
    CartCount: number;
    setCartCount: (value: number) => void;
    style: React.CSSProperties;
}

const Bead: React.FC<BeadProps> = ({CartCount ,setCartCount, style }) => {
    
        const showfilter = (category: string) => {
            // if now link != /bead time = 500 else 0
            const currentPath = window.location.pathname + window.location.hash;
            const delay = currentPath.includes('/productDetails') ? 700 : 0;
            console.log(currentPath,' ',delay)
            window.location.href = "/my-first-reactjs-project/#/bead";
            setTimeout(() => {
                document.querySelectorAll('.product-category').forEach(product => {
                    (product as HTMLElement).style.display = product.classList.contains(category) ? 'block' : 'none';
                });
                document.querySelectorAll('#product-filters button').forEach(btn => btn.classList.remove('active'));
                document.querySelector(`#product-filters button#${category}`)?.classList.add('active');
            }, delay);
        };

    
        const handleFilter = (filter: string) => {
            showfilter(filter);
        }

    return (
        <>
            <div id="bead" className="products section" style={style}>
                <div className="products-tool-container">
                    <section id="product-filters">
                        <button id="bracelets" className="btn btn-outline-primary active" onClick={() => handleFilter("bracelets")}>Bracelets</button>
                        <button id="keyring" className="btn btn-outline-primary" onClick={() => handleFilter("keyring")}>Keyring</button>
                        <button id="necklace" className="btn btn-outline-primary" onClick={() => handleFilter("necklace")}>Necklace</button>
                        <button id="phonestrap" className="btn btn-outline-primary" onClick={() => handleFilter("phonestrap")}>Phonestrap</button>
                    </section>
                    <section id="cart-products" style={{ minWidth: 'fit-content' }}>
                        <div className="cart-btn-container d-flex justify-content-end">
                            <button className="btn btn-outline-primary me-2" id="cartBtn">
                                🛒 cart (<span id="cartCount">{CartCount}</span> items)
                            </button>
                        </div>
                        <div className="cart-modal" id="cartModal">
                            <div id="cartContainer"></div>
                            <a href="/my-first-reactjs-project/#/checkout" className="btn btn-primary" style={{marginRight:'10px'}}>Checkout</a>
                            <button className="btn btn-secondary" id="closeCartBtn">Close</button>
                        </div>
                        <div className="cart-delete-confirm" id="cartDeleteConfirm">
                            <p className="confirm-text"></p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                                <button className="btn btn-primary" id="deleteItem">Yes</button>
                                <button className="btn btn-secondary" id="cancelDelete">No</button>
                            </div>
                        </div>
                    </section>
                </div>
                <Routes>
                    <Route path="/" element={
                        <BeadProducts setCartCount={setCartCount} />
                    }/>
                    <Route path="/productDetails" element={<ProductsDetails setCartCount={setCartCount} />} />
                </Routes>
            </div>
        </>
    )
}


export default Bead;
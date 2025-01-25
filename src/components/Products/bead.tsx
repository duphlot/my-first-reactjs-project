import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from 'react-router-dom';
import ProductsDetails from "./productsDetails";
import BeadProducts from "./BeadProducts";

interface Product {
    folder: string;
    name: string;
    filter: string;
    status: string;
    price: string;
}

interface Props {
    style: React.CSSProperties;
}

const Bead: React.FC<Props> = ({ style }) => {
        const [cartCount, setCartCount] = useState(0);
        const [productCards, setProductCards] = useState<JSX.Element[]>([]);
        const productPath = "images/productImg/";

    
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
    
        useEffect(() => {
            if (productCards.length > 0) showfilter('bracelets');
        }, [productCards]);
    
        // const handleAddToCartDetails = (event: Event) => {
        //     const productContainer = (event.target as HTMLElement).closest('#product-details') as HTMLElement;
        //     const productName = productContainer.querySelector('#product-name')?.textContent?.trim();
        //     const productDescription = productContainer.querySelector('#product-description')?.textContent?.trim();
        //     const productPrice = productContainer.querySelector('#product-price')?.textContent?.split(':')[1].trim();
        //     const productImage = productContainer.querySelector('.carousel-inner .active img')?.getAttribute('src'); // Lấy hình ảnh hiện tại trong carousel
        //     const productColorSelect = productContainer.querySelector('select') as HTMLSelectElement; 
        //     const productColor = productColorSelect ? productColorSelect.value : 'Default Color';

        //     const finalProductName = `${productName} - ${productColor}`;

        //     console.log(`Adding to cart: ${finalProductName}, Description: ${productDescription}, Price: ${productPrice}, Image: ${productImage}`);

        //     let toupi = JSON.parse(localStorage.getItem('toupi') || '[]');
        //     const existingProduct = toupi.find((product: { name: string }) => product.name === finalProductName);
        //     if (existingProduct) {
        //         existingProduct.quantity += 1;
        //     } else {
        //         const product = {
        //             name: finalProductName,
        //             description: productDescription,
        //             price: productPrice,
        //             image: productImage,
        //             quantity: 1
        //         };
        //         toupi.push(product);
        //     }

        //     localStorage.setItem('toupi', JSON.stringify(toupi));
        // };

        const handleAddToCart = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('addToCartBtn')) {
                let productCard = target.closest('.card');
                let productName = productCard?.querySelector('.card-title')?.textContent?.trim();
                const productPrice = productCard?.querySelector('.card-price')?.textContent?.replace('Price: ', '').trim();
                const productImage = productCard?.querySelector('img')?.getAttribute('src');
                const productColor = (productCard?.querySelector('#product-color') as HTMLSelectElement)?.value;
                productName = productName+ ' - ' + productColor;
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingProduct = cart.find((product: { name: string, color: string }) => product.name === productName && product.color === productColor);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push({ name: productName, price: productPrice, image: productImage, color: productColor, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }
        };

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((acc: number, product: { quantity: number }) => acc + product.quantity, 0);
            setCartCount(count);
        };

        const updateCartUI = () => {
            updateCartCount();
            showCart();
        };

        const removeFromCart = (productName: string) => {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const productIndex = cart.findIndex((product: { name: string }) => product.name === productName);
            if (productIndex !== -1) cart.splice(productIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        };

        const deleteCartItem = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('deleteCartItem')) {
                const productCard = target.closest('.cart-product');
                const productName = productCard?.querySelector('.cart-product-title')?.textContent;
                if (productName) {
                    const confirmText = document.querySelector('.confirm-text') as HTMLElement;
                    confirmText.textContent = `Are you sure you want to remove ${productName} from your cart?`;
                    document.getElementById('cartDeleteConfirm')!.style.display = 'block';
                    document.getElementById('deleteItem')!.addEventListener('click', () => {
                        removeFromCart(productName);
                        document.getElementById('cartDeleteConfirm')!.style.display = 'none';
                    });
                    document.getElementById('cancelDelete')!.addEventListener('click', () => {
                        document.getElementById('cartDeleteConfirm')!.style.display = 'none';
                    });
                }
            }
        };

        const showCart = () => {
            const cartModal = document.getElementById('cartModal');
            const cartContainer = document.getElementById('cartContainer');
            cartModal!.style.display = 'block';
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cartContainer!.innerHTML = cart.length === 0 ? '<p>Your cart is empty.</p>' : '';

            cart.forEach((item: { name: string; price: string; image: string; color: string; quantity: number }) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-product', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
                cartItem.innerHTML = `
                    <div class="flex-grow-1">
                        <h4 class="cart-product-title mb-1">${item.name}</h4>
                    </div>
                    <div class="d-flex align-items-center justify-content-center flex-grow-1">
                        <div class="item-price-quantity d-flex flex-column align-items-center">
                            <p class="cart-product-price mb-1" style="font-size: 1rem;">${item.price}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-secondary btn-sm adjust-quantity decreaseQuantityBtn me-2 d-flex align-items-center justify-content-center" style="font-size:1.2rem; width: 30px; height: 30px;">-</button>
                                <span class="quantity me-2" style="font-size: 1.2rem;">${item.quantity}</span>
                                <button class="btn btn-secondary btn-sm adjust-quantity increaseQuantityBtn d-flex align-items-center justify-content-center" style="font-size:1.2rem; width: 30px; height: 30px;">+</button>
                            </div>
                        </div>
                    </div>
                    <span class="trash-icon ms-3 deleteCartItem">&#128465;</span>
                `;
                cartContainer!.appendChild(cartItem);
            });

            document.querySelectorAll('.deleteCartItem').forEach(button => button.addEventListener('click', deleteCartItem));
            document.querySelectorAll('.increaseQuantityBtn').forEach(button => button.addEventListener('click', function(this: HTMLElement) {
                const productCard = this.closest('.cart-product');
                const productName = productCard?.querySelector('.cart-product-title')?.textContent;
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const product = cart.find((product: { name: string }) => product.name === productName);
                if (product) product.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }));
            document.querySelectorAll('.decreaseQuantityBtn').forEach(button => button.addEventListener('click', function(this: HTMLElement) {
                const productCard = this.closest('.cart-product');
                const productName = productCard?.querySelector('.cart-product-title')?.textContent;
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const productIndex = cart.findIndex((product: { name: string }) => product.name === productName);
                if (productIndex !== -1) {
                    if (cart[productIndex].quantity > 1) {
                        cart[productIndex].quantity -= 1;
                    } else {
                        cart.splice(productIndex, 1);
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }));
        };

        const closeCart = () => {
            document.getElementById('cartModal')!.style.display = 'none';
        };

        useEffect(() => {
            const productList = document.getElementById('product-list');
            const cartBtn = document.getElementById('cartBtn');
            const closeCartBtn = document.getElementById('closeCartBtn');
            const cartContainer = document.getElementById('cartContainer');
        
            productList?.addEventListener('click', handleAddToCart);
            cartBtn?.addEventListener('click', showCart);
            closeCartBtn?.addEventListener('click', closeCart);
            cartContainer?.addEventListener('click', deleteCartItem);
        

            // const productDetail = document.getElementById('product-details');
            // console.log(productDetail);
            // productDetail?.addEventListener('click', handleAddToCartDetails);
        }, []);  
        
    
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
                                🛒 cart (<span id="cartCount">{cartCount}</span> items)
                            </button>
                        </div>
                        <div className="cart-modal" id="cartModal">
                            <div id="cartContainer"></div>
                            <a href="/my-first-reactjs-project/#/checkout" className="btn btn-primary">Checkout</a>
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
                        <BeadProducts />
                    }/>
                    <Route path="/productDetails" element={<ProductsDetails />} />
                </Routes>
            </div>
        </>
    )
}

export default Bead
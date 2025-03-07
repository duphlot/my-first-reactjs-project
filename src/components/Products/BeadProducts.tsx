import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ProductsDetails from "./productsDetails";

interface Product {
    folder: string;
    name: string;
    filter: string;
    status: string;
    price: string;
}



const BeadProducts: React.FC<{ setCartCount: (value: number) => void }> = ({ setCartCount }) => {
    const [productCards, setProductCards] = useState<JSX.Element[]>([]);
    const productPath = "images/productImg/";

    // const [cartCount, setCartCount] = useState(0);

    const fetchProductData = async (): Promise<Product[]> => {
        const response = await fetch(`${productPath}/text.txt`);
        const text = await response.text();
        return text.split("\n").map(line => {
            const [folder, name, filter, status, price] = line.split("-").map(item => item.trim());
            return { folder, name, filter, status, price };
        }).filter(product => product.folder && product.name && product.filter && product.status && product.price);
    };

    const createProductCard = async (product: Product, index: number): Promise<JSX.Element> => {
        const imageFolder = `${productPath}${product.folder}`;
        const imageUrls = await Promise.all(
            Array.from({ length: 20 }, (_, i) => `${imageFolder}/${i + 1}.jpg`).map(async url => {
                try {
                    const response = await fetch(url);
                    if (response.ok) return url;
                } catch (error) {
                    console.error(`Error fetching image ${url}:`, error);
                }
                return null;
            })
        ).then(urls => urls.filter(url => url !== null));

        const colorFile = `${imageFolder}/color.txt`;
        const colorResponse = await fetch(colorFile);
        const colorText = await colorResponse.text();
        const colors = colorText.split("\n").map(line => line.trim()).filter(color => color);

        const temp = `/my-first-reactjs-project/#/bead/productDetails?sectionId=product-details&productId=${product.folder}&productPrice=${product.price}&productName=${product.name}&productStatus=${product.status}`;
        return (
            <div key={product.folder} className={`col product-category ${product.filter}`} id={product.folder}>
                <div className="card h-100">
                    <div id={`carouselExampleControls${index}`} className="carousel slide">
                        <a href={temp}>
                            <div className="carousel-inner">
                                {imageUrls.map((imageUrl, idx) => (
                                    <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                        <img src={imageUrl as string} className="card-img-top" alt={product.name} />
                                    </div>
                                ))}
                            </div>
                        </a>
                        
                        <button className="carousel-control-prev" type="button" data-bs-target={`#carouselExampleControls${index}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#carouselExampleControls${index}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className="card-body text-center">
                        <h5 className="card-title">{product.name}</h5>
                        <select className="form-select mb-3" id="product-color" aria-label="Select color">
                            {colors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                        <a href="#/bead" className={`card-price btn btn-primary ${product.status === "on" ? "addToCartBtn" : "soldOut"}`}>
                            {product.status === "on" ? `${product.price} VND` : "SOLD OUT!"}
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    const initProductList = async () => {
        const fetchedProducts = await fetchProductData();
        const productCardsPromises = await Promise.all(fetchedProducts.map((product, index) => createProductCard(product, index)));
        setProductCards(productCardsPromises);
    };

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
                        <p class="cart-product-price mb-1">${item.price}</p>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-secondary btn-sm adjust-quantity decreaseQuantityBtn me-2 d-flex align-items-center justify-content-center" >-</button>
                            <span class="quantity me-2">${item.quantity}</span>
                            <button class="btn btn-secondary btn-sm adjust-quantity increaseQuantityBtn d-flex align-items-center justify-content-center" >+</button>
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
                confirmText.textContent = `Xóa ${productName} khỏi giỏ hàng?`;
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
    

    const closeCart = () => {
        document.getElementById('cartModal')!.style.display = 'none';
    };

    useEffect(() => {
        initProductList();

        // default cart count
        updateCartCount();

        const productList = document.getElementById('product-list');
        const cartBtn = document.getElementById('cartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartContainer = document.getElementById('cartContainer');
        
        productList?.addEventListener('click', handleAddToCart);
        cartBtn?.addEventListener('click', showCart);
        closeCartBtn?.addEventListener('click', closeCart);
        cartContainer?.addEventListener('click', deleteCartItem);
    }, []);

    return (
        <div id="product-grid-lists" className="side-section">
            <h2 className="text-center mb-4"></h2>
            <div id="product-list" className="row row-cols-1 row-cols-md-3 g-4">
                {productCards}
            </div>
        </div>
    );
};

export default BeadProducts;

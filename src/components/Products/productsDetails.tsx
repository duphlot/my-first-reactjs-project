import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProductsDetails: React.FC<{ setCartCount: (value: number) => void }> = ({ setCartCount }) => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const sectionId = queryParams.get("sectionId") || "";
    const productId = queryParams.get("productId") || "";
    const productPrice = queryParams.get("productPrice") || "";
    const productName = queryParams.get("productName") || "";
    const productStatus = queryParams.get("productStatus") || "";

    const currentLink =  window.location.hash;


        const [productDetails, setProductDetails] = useState({
            sectionId: '',
            productId: '',
            productPrice: '',
            productName: '',
            productStatus: '',
            imageUrls: [] as string[],
            description: '',
            colors: [] as string[],
        });

    
        const showDetailsSection = async (
            sectionId: string,
            productId: string,
            productPrice: string,
            productName: string,
            productStatus: string
        ) => {
            const productFolder = `images/productImg/${productId}`;
    
            const imageUrls = await Promise.all(
                Array.from({ length: 10 }, (_, i) => `${productFolder}/${i + 1}.jpg`).map(async (url) => {
                    try {
                        const response = await fetch(url);
                        return response.ok ? url : null;
                    } catch (error) {
                        console.error(`Error fetching image ${url}:`, error);
                        return null;
                    }
                })
            ).then((urls) => urls.filter((url) => url !== null) as string[]);
    
            let description = '';
            try {
                const response = await fetch(`${productFolder}/details.txt`);
                description = await response.text();
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
    
            let colors: string[] = [];
            try {
                const response = await fetch(`${productFolder}/color.txt`);
                const text = await response.text();
                colors = text.split('\n').map((line) => line.trim()).filter((color) => color);
            } catch (error) {
                console.error('Error fetching product colors:', error);
            }
    
            setProductDetails({
                sectionId,
                productId,
                productPrice,
                productName,
                productStatus,
                imageUrls,
                description,
                colors,
            });
        };

        const handleAddToCartDetails = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('addToCartBtn')) {
                const productContainer = (event.target as HTMLElement).closest('#product-details') as HTMLElement;
                let productName = productContainer.querySelector('#product-name')?.textContent?.trim();
                const productDescription = productContainer.querySelector('#product-description')?.textContent?.trim();
                const productPrice = productContainer.querySelector('#product-price')?.textContent?.split(':')[1].trim();
                const productImage = productContainer.querySelector('.carousel-inner .active img')?.getAttribute('src'); 
                const productColorSelect = productContainer.querySelector('select') as HTMLSelectElement; 
                const productColor = productColorSelect ? productColorSelect.value : 'Default Color';

                productName = `${productName} - ${productColor}`;

                console.log(`Adding to cart: ${productName}, Description: ${productDescription}, Price: ${productPrice}, Image: ${productImage}`);

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

        const closeCart = () => {
            document.getElementById('cartModal')!.style.display = 'none';
        };
    

    useEffect(() => {
        // default cart count
        updateCartCount();

        showDetailsSection(sectionId, productId, productPrice, productName, productStatus);
        const productDetail = document.getElementById('product-details');
        productDetail?.addEventListener('click', handleAddToCartDetails);

        const cartBtn = document.getElementById('cartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartContainer = document.getElementById('cartContainer');
        
        cartBtn?.addEventListener('click', showCart);
        closeCartBtn?.addEventListener('click', closeCart);
        cartContainer?.addEventListener('click', deleteCartItem);
    }, []);

    console.log(currentLink);
    return (
        <>
            <div id="product-details" className="side-section">
                <div className="productDetails row justify-content-between align-items-center">
                    <div className="col-lg-6 col-md-12">
                        <div
                            id="product-details-carousel"
                            className="carousel slide"
                            data-bs-ride="carousel"
                            style={{ borderRadius: '5vh', maxWidth: '100vh' }}
                        >
                            <div className="carousel-inner" id="carousel-inner">
                                {productDetails.imageUrls.map((imgSrc, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img src={imgSrc} className="d-block w-100 carousel-img" alt={`${productDetails.productId} image ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="carousel-indicators" id="carousel-indicators">
                                {productDetails.imageUrls.map((_, index) => (
                                    <li
                                        key={index}
                                        data-bs-target="#product-details-carousel"
                                        data-bs-slide-to={index}
                                        className={index === 0 ? 'active' : ''}
                                    ></li>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#product-details-carousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#product-details-carousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="productDetailsText col-lg-6 col-md-12 text-center mb-3 mb-lg-0">
                        <div className="product-details-text">
                            <h5 id="product-name">{productDetails.productName}</h5>
                            <p id="product-description">{productDetails.description || 'Mô tả sản phẩm sẽ được cập nhật.'}</p>
                            <p id="product-price">Price: {productDetails.productPrice} VND</p>
                            <select className="form-select mb-3" id="product-color" aria-label="Select color">
                                {productDetails.colors.map((color, index) => (
                                    <option key={index} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                            <a
                                href={`/my-first-reactjs-project/${currentLink}`}
                                className={`btn btn-primary ${productDetails.productStatus === 'on' ? 'addToCartBtn' : 'soldOut'}`}
                            >
                                {productDetails.productStatus === 'on' ? 'Bỏ vô giỏ ik 🛒' : 'SOLD OUT!'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductsDetails;
import React, { useState, useEffect } from "react";

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

const BeadProducts: React.FC<Props> = ({ style }) => {
    const [cartCount, setCartCount] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [productCards, setProductCards] = useState<JSX.Element[]>([]);
    const productPath = "images/productImg/";

    // Read text.txt file to get product data
    const fetchProductData = async (): Promise<Product[]> => {
        const response = await fetch(`${productPath}/text.txt`);
        const text = await response.text();
        return text.split("\n").map((line) => {
            const [folder, name, filter, status, price] = line
                .split("-")
                .map((item) => item.trim());
            return { folder, name, filter, status, price };
        }).filter((product) => product.folder && product.name && product.filter && product.status && product.price);
    };

    // Create product card
    const createProductCard = async (product: Product, index: number): Promise<JSX.Element> => {
        const imageFolder = `${productPath}${product.folder}`;
        const imageUrls = await Promise.all(
            Array.from({ length: 20 }, (_, i) => `${imageFolder}/${i + 1}.jpg`).map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.ok) return url;
                } catch (error) {
                    console.error(`Error fetching image ${url}:`, error);
                }
                return null;
            })
        ).then((urls) => urls.filter((url) => url !== null));

        // Fetch colors from color.txt
        const colorFile = `${imageFolder}/color.txt`;
        const colorResponse = await fetch(colorFile);
        const colorText = await colorResponse.text();
        const colors = colorText.split("\n").map(line => line.trim()).filter(color => color);

        return (
            <div key={product.folder} className={`col product-category ${product.filter}`} id={product.folder}>
                <div className="card h-100">
                    <div id={`carouselExampleControls${index}`} className="carousel slide">
                        <div className="carousel-inner">
                            {imageUrls.map((imageUrl, idx) => (
                                <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                    <img src={imageUrl as string} className="card-img-top" alt={product.name} />
                                </div>
                            ))}
                        </div>

                        {/* Carousel controls */}
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carouselExampleControls${index}`}
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carouselExampleControls${index}`}
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    <div className="card-body text-center">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">Price: {product.price} VND</p>
                        <select className="form-select mb-3" id="product-color" aria-label="Select color">
                            {colors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                        <a
                            href="#"
                            className={`btn btn-primary ${product.status === "on" ? "addToCartBtn" : "soldOut"}`}
                        >
                            {product.status === "on" ? `${product.price} VND` : "SOLD OUT!"}
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    // Initialize product list
    const initProductList = async () => {
        const fetchedProducts = await fetchProductData();
        const productCardsPromises = await Promise.all(
            fetchedProducts.map((product, index) => createProductCard(product, index))
        );
        setProductCards(productCardsPromises);
    };

    // Show filter
    const showfilter = (category: string) => {
        document.querySelectorAll('.product-category').forEach(product => {
            if (product.classList.contains(category)) {
                (product as HTMLElement).style.display = 'block';
            } else {
                (product as HTMLElement).style.display = 'none';
            }
        });
        document.querySelectorAll('#product-filters button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`#product-filters button#${category}`)?.classList.add('active');
    };

    useEffect(() => {
        if (productCards.length > 0) {
            showfilter('bracelets'); 
        }
    }, [productCards]);

    useEffect(() => {
        initProductList();

        const handleAddToCart = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('addToCartBtn')) {
                const button = target;
                const productCard = button.closest('.card');
                const productName = productCard?.querySelector('.card-title')?.textContent?.trim();
                const productPrice = productCard?.querySelector('.card-text')?.textContent?.replace('Price: ', '').trim();
                const productImage = productCard?.querySelector('img')?.getAttribute('src');
                const productColor = (productCard?.querySelector('#product-color') as HTMLSelectElement)?.value;

                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingProduct = cart.find((product: { name: string, color: string }) => product.name === productName && product.color === productColor);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    const product = {
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        color: productColor,
                        quantity: 1
                    };
                    cart.push(product);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('Added to cart:', cart);
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
            if (productIndex !== -1) {
                cart.splice(productIndex, 1);
            }
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
                    const deleteItemBtn = document.getElementById('deleteItem') as HTMLElement;
                    deleteItemBtn.addEventListener('click', function() {
                        removeFromCart(productName);
                        document.getElementById('cartDeleteConfirm')!.style.display = 'none';
                    });
                    const cancelDeleteBtn = document.getElementById('cancelDelete') as HTMLElement;
                    cancelDeleteBtn.addEventListener('click', function() {
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
            cartContainer!.innerHTML = '';

            if (cart.length === 0) {
                cartContainer!.innerHTML = '<p>Your cart is empty.</p>';
            } else {
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
            }

            document.querySelectorAll('.deleteCartItem').forEach(button => {
                button.addEventListener('click', deleteCartItem);
            });

            document.querySelectorAll('.increaseQuantityBtn').forEach(button => {
                button.addEventListener('click', function(this: HTMLElement) {
                    const productCard = this.closest('.cart-product');
                    const productName = productCard?.querySelector('.cart-product-title')?.textContent;
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const product = cart.find((product: { name: string }) => product.name === productName);
                    if (product) product.quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });

            document.querySelectorAll('.decreaseQuantityBtn').forEach(button => {
                button.addEventListener('click', function(this: HTMLElement) {
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
                });
            });
        };

        const closeCart = () => {
            document.getElementById('cartModal')!.style.display = 'none';
        };

        const productList = document.getElementById('product-list');
        productList?.addEventListener('click', handleAddToCart);
        document.getElementById('cartBtn')?.addEventListener('click', showCart);
        document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
        document.getElementById('cartContainer')?.addEventListener('click', deleteCartItem);

        return () => {
            productList?.removeEventListener('click', handleAddToCart);
            document.getElementById('cartBtn')?.removeEventListener('click', showCart);
            document.getElementById('closeCartBtn')?.removeEventListener('click', closeCart);
        };
    }, []);

    const handleFilter = (filter: string) => {
        console.log(`Filter by: ${filter}`);
        showfilter(filter);
    };

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
                        <div className="cart-btn-container d-flex justify-content-end" style={{ marginBottom: '0 !important' }}>
                            <button className="btn btn-outline-primary me-2" id="cartBtn">
                                🛒 cart (<span id="cartCount">{cartCount}</span> items)
                            </button>
                        </div>
                        <div className="cart-modal" id="cartModal">
                            <div id="cartContainer"></div>
                            <a href="/checkout" className="btn btn-primary">Checkout</a>
                            <button className="btn btn-secondary" id="closeCartBtn">Close</button>
                        </div>
                        <div className="cart-delete-confirm" id="cartDeleteConfirm">
                            <p className="confirm-text"></p>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
                                <button className="btn btn-primary" id="deleteItem">Yes</button>
                                <button className="btn btn-secondary" id="cancelDelete">No</button>
                            </div>
                        </div>
                    </section>
                </div>

                <div id="product-grid-lists" className="side-section">
                    <h2 className="text-center mb-4"></h2>
                    <div id="product-list" className="row row-cols-1 row-cols-md-3 g-4">
                        {productCards}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BeadProducts;

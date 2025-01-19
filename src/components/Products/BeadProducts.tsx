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
    const [productCards, setProductCards] = useState<JSX.Element[]>([]); // Store JSX elements for cards
    const productPath = "images/productImg/";

    // Lấy dữ liệu sản phẩm
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

    // Tạo thẻ sản phẩm
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
                            {/* Color options from color.txt */}
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

    // Lấy dữ liệu sản phẩm và render sản phẩm
    const initProductList = async () => {
        const fetchedProducts = await fetchProductData();
        const productCardsPromises = await Promise.all(
            fetchedProducts.map((product, index) => createProductCard(product, index))
        );
        setProductCards(productCardsPromises);
    };

    useEffect(() => {
        initProductList();
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
                document.querySelector(`#product-filters button[onclick="showProductGrid(); showfilter('${category}')"]`)?.classList.add('active');
        }
        
        document.querySelectorAll('#customCard').forEach(card => {
                card.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                if (target && target.classList.contains('addToCartBtn')) {
                    const button = event.target as HTMLElement;
                    const productStyle = button.closest('.product-category')?.classList.contains('cookies');
                    const productCard = button.closest('.card');
                    const productName = productCard?.querySelector('.card-title')?.textContent?.trim();
                    const productPrice = (productCard?.querySelector('#product-color') as HTMLSelectElement)?.value;
                    const productImage = productCard?.querySelector('img')?.getAttribute('src');
                    console.log(`Adding to cart: ${productName}, Price: ${productPrice}, Style: ${productStyle}, Image: ${productImage}`);
        
                    let toupi = JSON.parse(localStorage.getItem('toupi') || '[]');
                    const existingProduct = toupi.find((product: { name: string }) => product.name === productName);
                    if (existingProduct) {
                    existingProduct.quantity += 1;
                    } else {
                    const product = {
                        name: `${productName} - ${productPrice}`,
                        price: productPrice,
                        style: productStyle,
                        image: productImage,
                        quantity: 1
                    };
                    toupi.push(product);
                    }
                    localStorage.setItem('toupi', JSON.stringify(toupi));
                }
                });
        });
        
            // Add other event listeners and handlers here similarly if needed
        return () => {
            // Cleanup event listeners if component is unmounted
            document.querySelectorAll('#customCard').forEach(card => {
                card.removeEventListener('click', () => {});
            });
        };
        
    }, []);

    const handleFilter = (filter: string) => {
        console.log(`Filter by: ${filter}`);
    };

    return (
        <>
            <div id="bead" className="products section" style={style}>
                <div className="products-tool-container">
                    <section id="product-filters">
                        <button className="btn btn-outline-primary" onClick={() => handleFilter("bracelets")}>
                            Bracelets
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => handleFilter("keyring")}>
                            Keyring
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => handleFilter("necklace")}>
                            Necklace
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => handleFilter("phonestrap")}>
                            Phonestrap
                        </button>
                    </section>

                    <section id="cart-products">
                        <button className="btn btn-outline-primary me-2">
                            🛒 Cart (<span>{cartCount}</span> items)
                        </button>
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

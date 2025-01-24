import React, { useState, useEffect } from "react";
import SlickCarousel from "./slickCarousel";
import { getDatabase, push, ref, set } from "firebase/database";
import app from "../firebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
    folder: string;
    name: string;
    status: string;
    price: string;
    imageName: string;
    position: string;
}

interface HomeProps {
    style?: React.CSSProperties;  // style chỉ truyền là một prop riêng biệt
}


const Home: React.FC<HomeProps> = ({ style }) => {
    // function write edit order 
    let [message, setMessage] = useState('');
    
    const saveData = async () => {
        const db = getDatabase(app);
        const newDoc = push(ref(db, 'góc tâm sự'));
        set(newDoc, {
            message: message
        }).then(() => {
            alert('Data saved successfully');
        }).catch((error) => {
            alert('Failed to save data');
        })
    }

    const [products, setProducts] = useState<Product[]>([]);
    const productImagePath = "images/newProducts/";
    const productTextFile = "images/newProducts/text.txt";

    // Lấy dữ liệu sản phẩm từ file text
    const fetchProductDataForGrid = async () => {
        const response = await fetch(productTextFile);
        const text = await response.text();
        return text.split("\n").map((line) => {
            const [folder, name, status, price, imageName, position] = line
                .split("-")
                .map((item) => item.trim());
            return { folder, name, status, price, imageName, position };
        }).filter(item => item.folder && item.name && item.status && item.price && item.imageName && item.position);
    };

    // Khởi tạo bảng sản phẩm
    const initProductGrid = async () => {
        const products = await fetchProductDataForGrid();
        setProducts(products);
    };

    useEffect(() => {
        initProductGrid();
    }, []);

    // Sự kiện khi nhấn sản phẩm
    const handleProductClick = (product: Product) => {
        console.log(`Product ${product.name} clicked`);
    };

    return (
        <div id="home" className="section" style={style}>
            {/* Carousel */}
            <div className="carousel-center-mode">
                <SlickCarousel />
            </div>

            {/* Home Content */}
            <div className="row head-tag" style={{ marginTop: "100px" }}>
                <div className="col-lg-6 col-md-12 section1 order-lg-1 order-2">
                    <div className="chat-box-comment">
                        <h2>Góc tâm sự</h2>
                        <p>
                            Có đề xuất gì thêm cho sản phẩm mới hay cần sốp chỉnh sửa / thay
                            đổi thì nhắn zô đây nhe
                        </p>
                        <div className="chat-box-input">
                            <input value={message} onChange={(e) => setMessage(e.target.value)}  type="text" placeholder="Nhập tin nhắn của bạn ở đây..." />
                            <button onClick={saveData}>Send</button>
                        </div>
                    </div>
                    <div className="text-container">
                        <div className="d-flex justify-content-between">
                            <p className="mb-0">📍Saigon</p>
                        </div>
                        <p className="mb-0">
                            <a
                                href="https://www.instagram.com/toupi.bnb/"
                                target="_blank"
                                rel="noopener noreferrer"
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <FontAwesomeIcon icon={faInstagram} /> toupi.bnb
                            </a>
                        </p>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 section2 order-lg-2 order-1">
                    <div className="best-seller">
                        <h5 className="new-product-tag">
                            <strong>Best Seller</strong>
                        </h5>
                        <div className="new-product-container">
                            {/* Render sản phẩm */}
                            <div id="product-grid" className="d-flex flex-wrap">
                                {products.map((product) => (
                                    <div
                                        key={product.folder}
                                        className="new-product"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className={`card ${product.position}`}>
                                            <img
                                                src={`${productImagePath}${product.imageName}`}
                                                alt={product.name}
                                                className="card-img-top"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

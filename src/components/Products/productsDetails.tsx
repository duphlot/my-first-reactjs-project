import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProductsDetails: React.FC = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const sectionId = queryParams.get("sectionId") || "";
    const productId = queryParams.get("productId") || "";
    const productPrice = queryParams.get("productPrice") || "";
    const productName = queryParams.get("productName") || "";
    const productStatus = queryParams.get("productStatus") || "";



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

    useEffect(() => {
        // Example usage
        showDetailsSection(sectionId, productId, productPrice, productName, productStatus);
    }, []);

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
                                href="/my-first-reactjs-project/#/bead/productDetails?sectionId=product-details&productId=product.folder&productPrice=product.price&productName=product.name&productStatus=product.status"
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
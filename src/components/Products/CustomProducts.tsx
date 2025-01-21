import React, { useEffect, useState } from 'react';

interface Props {
    style: React.CSSProperties;
}

const customPath = "images/custom/";
async function fetchCustomImages(): Promise<{ imageName: string; caption: string }[] | undefined> {
    try {
        const response = await fetch(`${customPath}/text.txt`);
        const text = await response.text();
        return text.split("\n").map(line => {
            const [imageName, caption] = line.split("-").map(item => item.trim());
            return { imageName, caption };
        }).filter(item => item.imageName && item.caption);
    } catch (error) {
        console.error("Error fetching custom images:", error);
    }
}

async function initCustomGallery() {
    const customContainer = document.getElementById("custom-gallery");
    if (customContainer && customContainer.children.length > 0) return; 

    const customImages = await fetchCustomImages();
    if (!customImages) return;

    const fragment = document.createDocumentFragment();
    let count = 0;
    customImages.forEach((item: { imageName: string; caption: string }) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("item");

        const imgElement = document.createElement("img");
        imgElement.src = `${customPath}${item.imageName}`;
        imgElement.alt = item.caption;
        imgElement.classList.add("img-fluid");

        imageWrapper.appendChild(imgElement);
        fragment.appendChild(imageWrapper);
        count++;
    });
    if (document.getElementById("custom-gallery")) {
        const temp = document.getElementById("custom-gallery");
        console.log(temp)
        if (temp) {
            temp.appendChild(fragment);
        }
    }

    const customDots = document.getElementById("carousel-dots");
    if (customDots && customDots.children.length > 0) return; 

    const dotsFragment = document.createDocumentFragment();
    const totalSlides = Math.ceil(count / 6);

    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        dotsFragment.appendChild(dot);
    }
    if (customDots) {
        customDots.appendChild(dotsFragment);
    }
}


function CustomProducts({ style }: Props) {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            initCustomGallery();
            setInitialized(true);
        }
    }, [initialized]);

    return (
        <>
            {/* Custom Products */}
            <div id="custom" className="section" style={style}>
                <div className="row" style={{ alignItems: 'end' }}>
                    <div className="col-lg-7 col-md-12">
                        <h1 className="text-center mb-4" style={{ fontSize: '40px' }}>Chỉ có 1 trên đời</h1>
                        <p className="mb-4" style={{ fontSize: '27px', paddingLeft: '10px' }}>Tự custom một chiếc vòng tay, móc khóa, dây chuyền hay phone strap mà khỏi lo đụng hàng với đứa mình ghét hay bất cứ ai </p>
                        <div className="custom-gallery-layout">
                            <div className="carousel-container">
                                <button className="carousel-arrow left-arrow">❮</button>
                                <div className="carousel-wrapper">
                                    <div id="custom-gallery" className="carousel"></div>
                                </div>
                                <button className="carousel-arrow right-arrow">❯</button>
                                <div id="carousel-dots" className="carousel-dots"></div>
                            </div>
                        </div>
                    </div>
                    <div id="customCard" className="col-lg-5 col-md-12">
                        <div className="product-category bracelets">
                            <div className="card">
                                <div id="carouselCustom" className="carousel slide">
                                    <div className="carousel-inner">
                                        <div className="carousel-item active"><img src="images/custom/custom.jpg" className="card-img-top" alt="pastel collection" /></div>
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <h2 className="card-title">một cái duy nhất</h2>
                                    <select className="form-select mb-3" id="product-color" aria-label="Select color">
                                        <option value="30,000 VND">30,000 VND</option>
                                        <option value="25,000 VND">25,000 VND</option>
                                        <option value="35,000 VND">35,000 VND</option>
                                        <option value="40,000 VND">40,000 VND</option>
                                    </select>
                                    <a href="#" className="btn btn-primary addToCartBtn">Thêm vào giỏ hàng</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CustomProducts;

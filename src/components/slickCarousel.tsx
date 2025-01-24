import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SlickCarousel: React.FC = () => {
    const settings = {
        centerMode: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        infinite: true,
        focusOnSelect: true, 
        adaptiveHeight: true,
        prevArrow: <button type="button" className="slick-prev"></button>,
        nextArrow: <button type="button" className="slick-next"></button>,
        responsive: [
        {
            breakpoint: 768,
            settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '2px',
            slidesToShow: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '2px',
            slidesToShow: 1,
            },
        },
        ],
    };

    return (
        <Slider {...settings}>
        <div>
            <img src="images/homeCarousel/2.jpg" className="img-fluid" alt="Image 1" />
        </div>
        <div>
            <img src="images/homeCarousel/3.jpg" className="img-fluid" alt="Image 2" />
        </div>
        <div>
            <img src="images/homeCarousel/4.jpg" className="img-fluid" alt="Image 3" />
        </div>
        <div>
            <img src="images/homeCarousel/1.jpg" className="img-fluid" alt="Image 4" />
        </div>
        </Slider>
    );
};

export default SlickCarousel;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// css
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'font-awesome/css/font-awesome.min.css'
import './components/css/App.css'
import './components/css/animation.css'
import './components/css/block.css'
import './components/css/carousel.css'
import './components/css/checkout.css'
import './components/css/custom.css'
import './components/css/newProducts.css'
import './components/css/product-details.css'
import './components/css/products.css'
import './components/css/slick.css'

//js
import 'bootstrap/dist/js/bootstrap.min.js'
import 'jquery/dist/jquery.min.js'
import 'slick-carousel/slick/slick.min.js'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <body>
      <App />
    </body>
  </React.StrictMode>,
)

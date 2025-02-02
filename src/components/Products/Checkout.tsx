import { getDatabase, push, ref, set } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import app from '../../firebaseConfig';

interface Props {
    style: React.CSSProperties;
}

interface ToupiItem {
    name: string;
    price: string;
    quantity?: number;
    image: string;
    style?: string;
}
let totalPrice = 0;

const Checkout: React.FC<Props> = ({ style }) => {
    const [isOtherAddressVisible, setIsOtherAddressVisible] = useState(false);
    const [igname, setIgname] = useState('');
    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('');
    const [products, setProducts] = useState<ToupiItem[]>([]);
    const [otherAddress, setOtherAddress] = useState('');

    const [cartGifts, setCartGifts] = useState<JSX.Element | null>(null);

    useEffect(() => {
        rendertoupi();
    }, []);

    const toggleOtherAddress = (select: HTMLSelectElement) => {
        setIsOtherAddressVisible(select.value === 'other');
    };

    const clearData = async() => {
        let toupi = JSON.parse(localStorage.getItem('cart') || '[]') as ToupiItem[];
        toupi = [];
        localStorage.setItem('cart', JSON.stringify(toupi)); 
        rendertoupi();
    }

    const saveBillingData = async () => {
        const db = getDatabase(app);
        const orderCode = createOrderCode();
        const newDoc = push(ref(db, 'order'));
        try {
            await set(newDoc, {
                igname,
                number,
                address: address === 'other' ? otherAddress : address || 'pick up',
                price: totalPrice,
                orderCode,
                products: products.map(p => ({ name: p.name, price: p.price, quantity: p.quantity })),
                status: 'chưa xác nhận',
                date: new Date().toISOString(),
            });
            showOrderCodeModal(orderCode);
            clearData();
        } catch (error) {
            console.error('Failed to save data', error);
        }
    };

    const createOrderCode = () => {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const randomValue = String(Math.floor(Math.random() * 100)).padStart(2, '0');
        return `${month}${day}-${hours}${randomValue}`;
    };

    const copyOrderCode = () => {
        const orderCodeElement = document.getElementById('orderCodeValue');
        if (orderCodeElement) {
            navigator.clipboard.writeText(orderCodeElement.innerText);
        }
    };

    const showOrderCodeModal = (orderCode: string) => {
        const modal = document.createElement('div');
        modal.id = 'orderCodeModal';
        modal.style.display = 'block';

        const closeModalButton = document.createElement('button');
        closeModalButton.id = 'closeModal';
        closeModalButton.innerHTML = '&times;';
        closeModalButton.onclick = () => {
            modal.style.display = 'none';
        };

        const orderCodeText = document.createElement('p');
        orderCodeText.className = 'ordercode';
        orderCodeText.innerText = 'Mã đơn hàng của bạn là:';

        const orderCodeValDiv = document.createElement('div');
        orderCodeValDiv.className = 'orderCodeVal';

        const orderCodeValueElement = document.createElement('h2');
        orderCodeValueElement.id = 'orderCodeValue';
        orderCodeValueElement.innerText = orderCode;

        const copyButton = document.createElement('button');
        copyButton.style.float = 'right';
        copyButton.onclick = copyOrderCode;

        const copyIcon = document.createElement('img');
        copyIcon.src = 'images/icon/copy.png';
        copyIcon.alt = 'Copy';
        copyIcon.style.width = '20px';
        copyIcon.style.height = '20px';

        copyButton.appendChild(copyIcon);
        orderCodeValDiv.appendChild(orderCodeValueElement);
        orderCodeValDiv.appendChild(copyButton);

        const noteText = document.createElement('p');
        noteText.className = 'note';
        noteText.innerText = 'Gửi mã này cho sốp qua ig để xác nhận đơn hàng nhé';

        modal.appendChild(closeModalButton);
        modal.appendChild(orderCodeText);
        modal.appendChild(orderCodeValDiv);
        modal.appendChild(noteText);

        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.display = 'none';
        }, 100000);
    };

    const rendertoupi = () => {
        const toupi = JSON.parse(localStorage.getItem('cart') || '[]') as ToupiItem[];
        setProducts(toupi);

        let cookiesCount = 0;
        let braceletsCount = 0;
        let braceletsTotalPrice = 0;
        let spiderVerseCount = 0;

        toupi.forEach(item => {
            const quantity = item.quantity || 1;
            const itemPrice = parseInt(item.price.replace(/\D/g, ''));

            if (item.style) {
                cookiesCount += quantity;
            } else {
                braceletsCount += quantity;
                braceletsTotalPrice += itemPrice * quantity;
            }
            if (item.name.includes('across the spider verse')) {
                spiderVerseCount += quantity;
            }
        });
        // calculate total price
        totalPrice = 0;
        toupi.forEach(item => {
            const quantity = item.quantity || 1;
            const itemPrice = parseInt(item.price.replace(/\D/g, ''));
            if (item.name.includes('across the spider verse') && spiderVerseCount >= 2) {
                totalPrice += 32000 * quantity;
            } else totalPrice += itemPrice * quantity;
        });

        // render gifts
        const giftDiv = (
            <div className="cart-item">
                <div className="item-details">
                    <img src="images/gift/product01/1.jpg" alt="Dango Key" className="item-image" />
                    <div>
                        <p className="item-name">Dango Key</p>
                    </div>
                </div>
                <div className="gift-price-tag">
                    <p className="item-total-price" style={{ marginBottom: 0 }}><a style={{ textDecoration: 'line-through' }}>10,000</a> VND</p>
                    <p style={{ marginBottom: 'none', fontSize: 'clamp(1rem, 1.2vw, 20rem)' }}><a>0</a> VND</p>
                </div>
            </div>
        );

        const GiftText = braceletsTotalPrice >= 50000 ? (
            <h2 style={{ fontSize: 'clamp(1rem, 1.5vw, 20rem)' }}>sốp tặng bạng nèe</h2>
        ) : (
            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 20rem)' }}>chỉ cần thêm ${(50000 - braceletsTotalPrice)/1000}k nữa là bạn sẽ được nhận 1 dango keyring từ sốp</p>
        );

        const newCartGifts = braceletsTotalPrice >= 50000 ? (
            <>
                {GiftText}
                {giftDiv}
            </>
        ) : (
            GiftText
        );

        setCartGifts(newCartGifts);
    };
    
    const renderCartItems = () => {
        function removeItem(index: number) {
            const toupi = JSON.parse(localStorage.getItem('cart') || '[]') as ToupiItem[];
            toupi.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(toupi));
            rendertoupi();
        }

        function adjustQuantity(action: 'increase' | 'decrease', index: number) {
            const toupi = JSON.parse(localStorage.getItem('cart') || '[]') as ToupiItem[];
            let quantity = toupi[index].quantity || 1;
            if (action === 'increase') {
                quantity++;
                toupi[index].quantity = quantity; 
                localStorage.setItem('cart', JSON.stringify(toupi)); 
                rendertoupi(); 
            } else if (action === 'decrease' && quantity > 1) {
                quantity--;
                toupi[index].quantity = quantity; 
                localStorage.setItem('cart', JSON.stringify(toupi)); 
                rendertoupi(); 
            } else if (action === 'decrease' && quantity === 1) {
                removeItem(index);
            }
        }

        return products.map((item, index) => {
            const quantity = item.quantity || 1;
            const itemPrice = parseInt(item.price.replace(/\D/g, ''));
            let totalItemPrice = itemPrice * quantity;
            return (
                <div className="cart-item" key={index}>
                    <div className="item-details">
                        <span className="trash-icon" onClick={() => removeItem(index)}>&#128465;</span>
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div>
                            <p className="item-name">{item.name}</p>
                            <p className="item-price-quantity">
                                <button className="btn btn-secondary btn-sm adjust-quantity" onClick={(e) => { e.preventDefault(); adjustQuantity('decrease', index); }}>-</button>
                                <span className="quantity">{quantity}</span>
                                <button className="btn btn-secondary btn-sm adjust-quantity" onClick={(e) => { e.preventDefault(); adjustQuantity('increase', index); }}>+</button>
                            </p>
                        </div>
                    </div>
                    {item.name.includes('across the spider verse') && products.reduce((acc, p) => p.name.includes('across the spider verse') ? acc + (p.quantity || 1) : acc, 0) >= 2 ? (
                        <div className="gift-price-tag">
                            <p className="item-total-price" style={{ marginBottom: 0 }}><a style={{ textDecoration: 'line-through' }}>{totalItemPrice.toLocaleString()}</a> VND</p>
                            <p style={{ marginBottom: 'none' }}><a>{(totalItemPrice = 32000 * quantity).toLocaleString()}</a> VND</p>
                        </div>
                    ) : (
                        <p className="item-total-price">{totalItemPrice.toLocaleString()} VND</p>
                    )}
                </div>
            );
        });
    };
    console.log('totalPrice', totalPrice);
    return (
        <div id="checkout" className="section" style={style}>
            <form id="checkout-form" className="checkout-form">
                <div className="row">
                    <div className="col-md-6 billing-details">
                        <h4 className="title mb-4" style={{fontWeight: '800' }}>Thông tin mua hàng</h4>
                        <div className="mb-3 question">
                            <label htmlFor="billing-name" className="form-label underline">Cho xin tên instagram nhoaa</label>
                            <input type="text" className="form-control" id="billing-name" value={igname} onChange={(e) => setIgname(e.target.value)} required />
                        </div>
                        <div className="mb-3 question">
                            <label htmlFor="billing-number" className="form-label">Xin số điện thoại nữaa</label>
                            <input type="text" className="form-control" id="billing-number" value={number} onChange={(e) => setNumber(e.target.value)} required />
                        </div>
                        <div className="mb-3 question">
                            <label htmlFor="billing-address" className="form-label">Mún nhận hàng sao nè</label>
                            <select value={address} onChange={(e) => { setAddress(e.target.value); toggleOtherAddress(e.target); }} id="billing-address" className="form-control" required>
                                <option value="pick up">để tui qua lấy</option>
                                <option value="other">sốp giao dùm tui ii</option>
                            </select>
                            {isOtherAddressVisible && (
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    id="other-address"
                                    placeholder="nhập địa chỉ nhận hàng ở đây"
                                    required
                                    value={otherAddress}
                                    onChange={(e) => setOtherAddress(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-md-6 order-summary">
                        <h4 className="title mb-4" style={{ fontWeight: 800 }}>Order Summary</h4>
                        <div id="cartItems" className="mb-3">
                            {renderCartItems()}
                        </div>
                        <div id="cartGifts" className="mb-3">
                            {cartGifts}
                        </div>
                        <div id="discountCombos" style={{ marginTop: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}></div>
                        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 20rem)' }}><strong>Tổng tiền là :</strong> <span id="subtotal">{totalPrice.toLocaleString()}</span> VND</p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button type="button" className="btn btn-primary w-50" onClick={saveBillingData}>Place Order</button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;

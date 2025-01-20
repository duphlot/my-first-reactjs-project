import { getDatabase, push, ref, set } from 'firebase/database';
import React, { useState } from 'react';
import app from '../../firebaseConfig';

interface Props {
    style: React.CSSProperties;
}


function Checkout({style}: Props) {
    // function that can be used to toggle the visibility of the other address input
    const [isOtherAddressVisible, setIsOtherAddressVisible] = useState(false);
    function toggleOtherAddress(select: HTMLSelectElement) {
        setIsOtherAddressVisible(select.value === 'other');
    }

    // input set up
    let [igname, setIgname] = useState('');
    let [number, setNumber] = useState('');
    let [address, setAddress] = useState('');
    let [products, setProducts] = useState('');
    let [quantity, setQuantity] = useState('');
    let [subtotal, setSubtotal] = useState(0);
    let [otherAddress, setOtherAddress] = useState('');

    const saveData = async () => {
        const db = getDatabase(app);
        const newDoc = push(ref(db, 'order'));
        set(newDoc, {
            igname: igname,
            number: number,
            address: address ===  'other' ? otherAddress : address, 
            price: subtotal

        }).then(() => {
            alert('Data saved successfully');
        }).catch((error) => {
            alert('Failed to save data');
        })
    }





    // tạm thời để vậy, mốt xóa đi
    const orderCodeValue = '';
    function copyOrderCode() {
        const orderCode = document.getElementById('orderCodeValue') as HTMLInputElement;
        if (orderCode) {
            navigator.clipboard.writeText(orderCode.innerText);
        }
    }

    
    return (
        <>
            <div id="checkout" className="section"  style={style}>
                <form id="checkout-form" className="checkout-form">
                    <div className="row">
                        {/* Billing Details */}
                        <div className="col-md-6 billing-details">
                            <h4 className="mb-4" style={{fontSize: '25px', fontWeight: '800'}}> Thông tin mua hàng</h4>
                            {/* Name */}
                            <div className="mb-3">
                                <label htmlFor="billing-name" className='form-label'>Cho xin tên instagram nhoaa</label>
                                <input type="text" className ="form-control" id="billing-name" value={igname} onChange={(e) => setIgname(e.target.value)} required/>
                            </div>
                            {/* Phone */}
                            <div className="mb-3">
                                <label htmlFor="billing-number" className="form-label">Xin số điện thoại nữaa</label>
                                <input type="text" className="form-control" id="billing-number" value={number} onChange={(e) => setNumber(e.target.value)} required/>
                            </div>
                            {/* Address */}
                            <div className="mb-3">
                                <label htmlFor="billing-address" className="form-label" >Mún nhận hàng sao nè</label>
                                <select value={address} onChange={(e) => { setAddress(e.target.value); toggleOtherAddress(e.target); }} id="billing-adress" className='form-control' required>
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
                                    value = {otherAddress} onChange={(e) => setOtherAddress(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        {/* Order Summary */}
                        <div className="col-md-6 order-summary">
                            <h4 className="mb-4" style={{ fontSize: '25px', fontWeight: 800 }}> Order Summary </h4>
                            <div id="cartItems" className="mb-3"></div>
                            <div id="cartGifts" className="mb-3"></div>
                            <div id="discountCombos" style={{ marginTop: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}></div>
                            <p> <strong>Tổng tiền là :</strong> <span id="subtotal">{subtotal}</span> VND </p>
                        </div>    
                    </div>
                    {/* Place Order */}
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-primary w-50" onClick={saveData}>Place Order</button>
                    </div>
                    {/* Overlay and Modals */}
                    <div id="overlay"></div>
                    <div id="loading">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>
                    <div id="success">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="2" />
                        <path id="checkmark" d="M6 12l4 4 8-8" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </div>
                    {orderCodeValue && (
                        <div id="orderCodeModal" style={{ display: 'block' }}>
                            <button id="closeModal">&times;</button>
                            <p className="ordercode">Mã đơn hàng của bạn là:</p>
                            <div className="orderCodeVal">
                            <h2 id="orderCodeValue">{orderCodeValue}</h2>
                            <button style={{ float: 'right' }} onClick={() => copyOrderCode()}>
                                <img src="images/icon/copy.png" alt="Copy" style={{ width: '20px', height: '20px' }} />
                            </button>
                            </div>
                            <p className="note">Gửi mã này cho sốp qua ig để xác nhận đơn hàng nhé </p>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}

export default Checkout;
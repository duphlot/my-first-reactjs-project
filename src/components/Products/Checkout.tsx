import { getDatabase, push, ref, set } from 'firebase/database';
import React, { useState } from 'react';
import app from '../../firebaseConfig';

let orderCodeValue ='';

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

    const saveBillingData = async () => {
        const db = getDatabase(app);
        let temp = createOrderCode();
        const newDoc = push(ref(db, 'order'));
        set(newDoc, {
            igname: igname,
            number: number,
            address: address ===  'other' ? otherAddress : address === '' ? 'pick up' : address, 
            price: subtotal,
            orderCode: temp
        }).then(() => {
            orderCodeValue = temp;
            console.log('Data saved successfully');
            if (orderCodeValue) {
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
                orderCodeValueElement.innerText = orderCodeValue;

                const copyButton = document.createElement('button');
                copyButton.style.float = 'right';
                copyButton.onclick = () => copyOrderCode();

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
            }
            console.log(orderCodeValue);
            }).catch((error) => {
            console.log('Failed to save data');
        })
    }

    // fuction creat code value
    function createOrderCode() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const randomValue = String(Math.floor(Math.random() * 100)).padStart(2, '0');
        return `${month}${day}-${hours}${randomValue}`;
    }
    
    // function copy order code
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
                        <button type="button" className="btn btn-primary w-50" onClick={saveBillingData}>Place Order</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Checkout;
import React from 'react';

interface Props {
    style: React.CSSProperties;
}

function Checkout({style}: Props) {
    return (
        <>
            <div id="checkout" className="section"  style={style}>
                <form id="checkout-form" className="checkout-form">
                    <div className="row">
                    <div className="col-md-6 billing-details">
                        <h4 className="mb-4">Thông tin mua hàng</h4>
                        <div className="mb-3">
                        <label htmlFor="billing-name" className="form-label">Tên Instagram</label>
                        <input type="text" className="form-control" id="billing-name" required />
                        </div>
                    </div>
                    </div>
                    <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary w-50">Place Order</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Checkout;

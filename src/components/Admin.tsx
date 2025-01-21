import { getDatabase, ref, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import app from '../firebaseConfig';

//css
import './css/Admin.css';

interface Props {
    style: React.CSSProperties;
}

interface productsType {
    name: string;
    price: string;
    quantity: string;
}

interface ToupiItem {
    igname: string;
    number: string;
    address: string;
    price: string;
    orderCode?: string;
    products: productsType[];
    status?: string;
    date?: string;
}

function Admin() {
    const navigate = useNavigate();

    let [order, setOrder] = useState<ToupiItem[]>([]);
    let [searchTerm, setSearchTerm] = useState<string>('');
    let [filterTerm, setFilterTerm] = useState<string>('');
    let [sortOption, setSortOption] = useState<'orderCode' | 'igname' | 'number' | 'address' | 'price' | 'status' | 'date'>('orderCode');

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, 'order');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setOrder(Object.values(snapshot.val()));
            console.log(snapshot.val());
        } else {
            alert('No data available');
        }
    };

    const handleSearch = () => {
        const foundOrders = order.filter((item) =>
            Object.values(item).some((value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        if (foundOrders.length > 0) {
            setOrder(foundOrders);
        } else {
            alert('Order not found');
        }
    };

    const handleFilter = () => {
        const filteredOrders = order.filter((item) =>
            item.products.some((product) =>
                Object.values(product).some((value) =>
                    typeof value === 'string' && value.toLowerCase().includes(filterTerm.toLowerCase())
                )
            )
        );
        setOrder(filteredOrders);
    };

    const handleSort = (orders: ToupiItem[]) => {
        return orders.sort((a, b) => {
            if ((a[sortOption] ?? '') < (b[sortOption] ?? '')) return -1;
            if ((a[sortOption] ?? '') > (b[sortOption] ?? '')) return 1;
            return 0;
        });
    };

    useEffect(() => {
        fetchData();
    }, []);    

    return (
        <div className="admin-container">
            <h1 className="admin-title">Show the all order billing</h1>
            <div className="admin-controls">
                <button className="admin-button" onClick={fetchData}>Reload</button>
                <div className="search-container">
                    
                    <div className="sort-container">
                        <label htmlFor="sort">Sort by: </label>
                        <select
                            id="sort"
                            className="sort-select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as 'orderCode' | 'igname' | 'number' | 'address' | 'price' | 'status' | 'date')}
                        >
                            <option value="orderCode">Order Code</option>
                            <option value="igname">IG Name</option>
                            <option value="number">Number</option>
                            <option value="address">Address</option>
                            <option value="price">Price</option>
                            <option value="status">Status</option>
                            <option value="createdAt">Date</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by any field"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Order Code</th>
                        <th>tên ig</th>
                        <th>Number</th>
                        <th>Address</th>
                        <th>Item</th>
                        <th>giá</th>
                        <th>sl</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {handleSort(order).map((item, index) => (
                        <tr key={index} className="order-row">
                            <td className="order-code">{item.orderCode}</td>
                            <td className="order-igname">{item.igname}</td>
                            <td className="order-number">{item.number}</td>
                            <td className="order-address">{item.address}</td>
                            <td className="order-products">
                                {item.products && Array.isArray(item.products) ? (
                                    item.products.map((product, idx) => (
                                        <div key={idx} className="product-details">
                                            <span className="product-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {product.name}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span>No products available</span>
                                )}
                            </td>
                            <td className="order-products">
                                {item.products && Array.isArray(item.products) ? (
                                    item.products.map((product, idx) => (
                                        <div key={idx} className="product-details">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price.replace(/,/g, '').replace('VND','')))}
                                        </div>
                                    ))
                                ) : (
                                    <span>No products available</span>
                                )}
                            </td>
                            <td className="order-products">
                                {item.products && Array.isArray(item.products) ? (
                                    item.products.map((product, idx) => (
                                        <div key={idx} className="product-details">
                                            <span className="product-quantity">{product.quantity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span>No products available</span>
                                )}
                            </td>
                            <td className="order-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price))}
                            </td>
                            <td className="order-status">
                                <select
                                    value={item.status}
                                    onChange={(e) => {
                                        const updatedOrder = [...order];
                                        updatedOrder[index].status = e.target.value;
                                        setOrder(updatedOrder);
                                    }}
                                >
                                    <option value="chưa xác nhận">Chưa xác nhận</option>
                                    <option value="đã xác nhận">Đã xác nhận</option>
                                    <option value="đã hoàn thành">Đã hoàn thành</option>
                                </select>
                            </td>
                            <td className="order-date">{new Date(item.date ?? '').toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;

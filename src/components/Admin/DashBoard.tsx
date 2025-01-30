import { getDatabase, ref, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import app from '../../firebaseConfig';
import '../css/dashboard.css';
import '../css/admin.css';

interface productsType {
  name: string;
  price: string;
  quantity: string;
}

interface ToupiItem {
  fireBaseID: string;
  igname: string;
  number: string;
  address: string;
  price: string;
  orderCode?: string;
  products: productsType[];
  status?: string;
  date?: string;
}

const OrderDetail: React.FC = () => {
  const [order, setOrder] = useState<ToupiItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, 'order');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const dataArray = Object.keys(data).map((key) => ({ ...data[key], fireBaseID: key }));
      setOrder(dataArray);
    } else {
      alert('No data available');
    }
  };

  const getTotalOrders = () => order.length;

  const getOrdersByStatus = (status: string) => order.filter((o) => o.status === status).length;

  const getOrdersByDate = () => {
    const ordersByDate: { [key: string]: number } = {};
    order.forEach((o) => {
      const date = o.date?.split('T')[0] || 'Unknown';
      if (!ordersByDate[date]) {
        ordersByDate[date] = 0;
      }
      ordersByDate[date]++;
    });
    return Object.entries(ordersByDate).map(([date, count]) => [date, count]);
  };

  const OrderChart = () => {
    const data = [
      ['Status', 'Number of Orders'],
      ['Chưa xác nhận', getOrdersByStatus('chưa xác nhận')],
      ['Đã xác nhận', getOrdersByStatus('đã xác nhận')],
      ['Hoàn thành', getOrdersByStatus('đã hoàn thành')],
    ];

    const options = {
      title: 'Order Status Distribution',
      pieHole: 0.4,
      is3D: false,
      colors: ['#FF7043', '#66BB6A', '#42A5F5'],
      fontName: 'Arial',
      fontSize: 14,
      titleTextStyle: {
        fontSize: 18,
        bold: true,
        color: '#333',
      },
      legend: {
        position: 'bottom',
        textStyle: {
          fontSize: 14,
          color: '#333',
        },
      },
      tooltip: {
        textStyle: {
          fontSize: 14,
          color: '#333',
        },
      },
      chartArea: {
        width: '90%',
        height: '75%',
      },
      pieSliceText: 'value',
      slices: {
        0: { offset: 0.1 },
        1: { offset: 0.1 },
        2: { offset: 0.1 },
      },
      backgroundColor: '#f4f4f4',
    };

    return (
      <div className="chart-container">
        <Chart chartType="PieChart" data={data} options={options} width={'100%'} height={'400px'} />
      </div>
    );
  };

  const OrderLineChart = () => {
    const data = [['Date', 'Number of Orders'], ...getOrdersByDate()];

    const options = {
      title: 'Orders Over Time',
      hAxis: { title: 'Date', textStyle: { color: '#333' }, titleTextStyle: { color: '#333' } },
      vAxis: { title: 'Number of Orders', textStyle: { color: '#333' }, titleTextStyle: { color: '#333' } },
      curveType: 'function',
      colors: ['#42A5F5'],
      fontName: 'Arial',
      fontSize: 14,
      titleTextStyle: {
        fontSize: 18,
        bold: true,
        color: '#333',
      },
      legend: {
        position: 'bottom',
        textStyle: {
          fontSize: 14,
          color: '#333',
        },
      },
      tooltip: {
        textStyle: {
          fontSize: 14,
          color: '#333',
        },
      },
      chartArea: {
        width: '90%',
        height: '75%',
      },
      gridlines: {
        color: '#ccc',
      },
      backgroundColor: '#f4f4f4',
      pointSize: 5,
      lineWidth: 3,
    };

    return (
      <div className="chart-container">
        <Chart chartType="LineChart" data={data} options={options} width={'100%'} height={'400px'} />
      </div>
    );
  };

  return (
    <div className="order-detail">
      <div className="order-summary">
        <div className="total-orders">Total Orders: {getTotalOrders()}</div>
        <div className="orders-pending">Orders chưa xác nhận: {getOrdersByStatus('chưa xác nhận')}</div>
        <div className="orders-confirmed">Orders chưa hoàn thành: {getOrdersByStatus('đã xác nhận')}</div>
      </div>
      <div className="order-charts">
        <OrderChart />
        <OrderLineChart />
      </div>
    </div>
  );
};

export default OrderDetail;

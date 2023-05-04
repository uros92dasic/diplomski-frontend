import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Wrapper from '../../components/Wrapper';
import axios from 'axios';
import { Order } from '../../models/order';
import withPermission from '../../permissions/withPermission';

const OrderExport: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/orders/${orderId}`);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
                alert('An error occurred while fetching the order. Please try again later.');
            }
        };

        fetchOrder();
    }, [orderId]);

    const exportCSV = async () => {
        try {
            const { data } = await axios.get(`/orders/export/${orderId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `order-${orderId}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting order:', error);
            alert('An error occurred while exporting the order. Please try again later.');
        }
    };

    if (!order) return <Wrapper>Loading order data...</Wrapper>;

    return (
        <Wrapper>
            <h3>Order Preview</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Title</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.product.title}</td>
                            <td>{item.quantity}</td>
                            <td>{item.product.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-primary" onClick={exportCSV}>
                Export
            </button>
        </Wrapper>
    );
};

export default withPermission(OrderExport, 'editOrders');

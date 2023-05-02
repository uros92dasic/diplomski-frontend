import React, { useState, useEffect } from 'react';
import Wrapper from '../../components/Wrapper';
import Paginator from '../../components/Paginator';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(0);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get(`orders?page=${page}`);

                setOrders(data.data);
                setLastPage(data.meta.lastPage);
            }
        )();
    }, [page]);


    const handleSelect = (id: number) => {
        setSelected(selected === id ? 0 : id);
    };

    const show = {
        display: 'table-row'
    };

    const hide = {
        display: 'none'
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`/orders/${id}`);
                setOrders(orders.filter((o: Order) => o.id !== id));
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error deleting order:', error.message);
                    alert('An error occurred while deleting the order. Please try again later.');
                } else {
                    console.error('Error deleting order:', error);
                    alert('An unknown error occurred while deleting the order. Please try again later.');
                }
            }
        }
    }



    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <Link to={'/orders/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order) => {
                            return (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>{order.id}</td>
                                        <td>{order.user.firstName}</td>
                                        <td>{order.total}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleSelect(order.id)}
                                            >
                                                View
                                            </button>

                                            <div className="btn-group mr-2">
                                                <Link to={`/orders/export/${order.id}`} className="btn btn-sm btn-outline-secondary">Export</Link>
                                            </div>

                                            <div className="btn-group mr-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(order.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr
                                        key={order.id * 1000}
                                        style={selected === order.id ? show : hide}
                                    >
                                        <td colSpan={5}>
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Product Title</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.orderItems.map((item: OrderItem) => (
                                                        <tr key={item.id}>
                                                            <td>{item.id}</td>
                                                            <td>{item.product.title}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.product.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
        </Wrapper>
    );
};

export default Orders;

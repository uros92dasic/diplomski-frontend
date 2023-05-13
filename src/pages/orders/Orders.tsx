import React, { useState, useEffect } from 'react';
import Wrapper from '../../components/Wrapper';
import Paginator from '../../components/Paginator';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import withPermission from '../../permissions/withPermission';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { showErrorMessage, showSuccessMessage } from '../../components/messages/Messages';
import { useDispatch } from 'react-redux';
import "../../App.css";

const tableStyles = {
    counterColumnWidth: "5%",
    createdAtColumnWidth: "25%",
    totalColumnWidth: "25%",
    actionColumnWidth: "30%",
    userNameColumnWidth: "15%",
};

const innerStyles = {
    counterColumnWidth: "5%",
    sellerColumnWidth: "25%",
    productTitleColumnWidth: "25%",
    quantityColumnWidth: "20%",
    priceColumnWidth: "25%",
};

const Orders = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;

    const dispatch = useDispatch();

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
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`/orders/${id}`);
                setOrders(orders.filter((o: Order) => o.id !== id));
                dispatch(showSuccessMessage("Order deleted successfully."));
            } catch (error) {
                dispatch(showErrorMessage("Error while deleting order."));
            }
        }
    }

    const counter = (page - 1) * 10 + 1;

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <div className="header-controls">
                    <div className="pt-3">
                        <Link to={'/orders/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
                    </div>
                    <div className="paginator-container">
                        <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th style={{ width: tableStyles.counterColumnWidth }}>#</th>
                            <th style={{ width: tableStyles.createdAtColumnWidth }}>Created at</th>
                            <th style={{ width: tableStyles.totalColumnWidth }}>Total</th>
                            <th style={{ width: tableStyles.actionColumnWidth }}>Action</th>
                            <th style={{ width: tableStyles.userNameColumnWidth }}>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order, index: number) => {
                            const isCurrentUserCreator = order.userId === currentUserId;
                            return (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>{counter + index}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td>{order.total}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleSelect(order.id)}
                                            >
                                                View
                                            </button>

                                            {isCurrentUserCreator && (
                                                <>
                                                    <div className="btn-group mr-2">
                                                        <Link to={`/orders/export/${order.id}`} className="btn btn-sm btn-outline-secondary">Export</Link>
                                                    </div>

                                                    <div className="btn-group mr-2">
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(order.id)}>Delete</button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                        <td>{`${order.user.firstName} ${order.user.lastName}`}</td>
                                    </tr>
                                    <tr
                                        key={order.id * 1000}
                                        style={selected === order.id ? show : hide}
                                    >
                                        <td colSpan={5}>
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: innerStyles.counterColumnWidth }}>#</th>
                                                        <th style={{ width: innerStyles.sellerColumnWidth }}>Seller</th>
                                                        <th style={{ width: innerStyles.productTitleColumnWidth }}>Product Title</th>
                                                        <th style={{ width: innerStyles.quantityColumnWidth }}>Quantity</th>
                                                        <th style={{ width: innerStyles.priceColumnWidth }}>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.orderItems.map((item: OrderItem, index: number) => (
                                                        <tr key={item.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{`${item.product.user.firstName} ${item.product.user.lastName}`}</td>
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
        </Wrapper>
    );
};

export default withPermission(Orders, 'viewOrders');

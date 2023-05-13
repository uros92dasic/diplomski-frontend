import axios from "axios";
import React, { CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { Product } from "../../models/product";
import withPermission from "../../permissions/withPermission";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";
import { useDispatch } from "react-redux";
import "../../App.css";

const tableStyles = {
    counterColumnWidth: "5%",
    userColumnWidth: "15%",
    imageColumnWidth: "12%",
    titleColumnWidth: "15%",
    descriptionColumnWidth: "30%",
    priceColumnWidth: "8%",
    actionColumnWidth: "15%",
};

const imageStyles: CSSProperties = {
    width: '55px',
    height: '55px',
    objectFit: 'fill' as 'fill',
};

const Products = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;

    const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    const [showOnlyMyProducts, setShowOnlyMyProducts] = useState(false);

    const toggleShowOnlyMyProducts = () => {
        setShowOnlyMyProducts(!showOnlyMyProducts);
        setPage(1)
    };

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get(`products?page=${page}&search=${searchTerm}` + (showOnlyMyProducts ? `&userId=${+currentUserId}` : ''));

                setProducts(data.data);
                setLastPage(data.meta.lastPage);
            }
        )();
    }, [page, searchTerm, showOnlyMyProducts, currentUserId]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`/products/${id}`);
                setProducts(products.filter((p: Product) => p.id !== id));
                dispatch(showSuccessMessage("Product deleted successfully."));
            } catch (error) {
                dispatch(showErrorMessage("Error while deleting product."));
            }
        }

        setProducts(products.filter((p: Product) => p.id !== id));
    }

    const counter = (page - 1) * 10 + 1;

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <div className="header-controls">
                    <div className="pt-3">
                        <Link to={'/products/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
                        <div className="form-check form-switch pt-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="showOnlyMyProducts"
                                checked={showOnlyMyProducts}
                                onChange={toggleShowOnlyMyProducts}
                            />
                            <label className="form-check-label" htmlFor="showOnlyMyProducts">
                                Show only my products
                            </label>
                        </div>
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
                            <th style={{ width: tableStyles.userColumnWidth }}>User</th>
                            <th style={{ width: tableStyles.imageColumnWidth }}>Image</th>
                            <th style={{ width: tableStyles.titleColumnWidth }}>Title</th>
                            <th style={{ width: tableStyles.descriptionColumnWidth }}>Description</th>
                            <th style={{ width: tableStyles.priceColumnWidth }}>Price</th>
                            <th style={{ width: tableStyles.actionColumnWidth }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map((product: Product, index: number) => {
                            const isCurrentUserCreator = product?.user?.id === currentUserId;
                            return (
                                <tr key={product.id}>
                                    <td>{counter + index}</td>
                                    <td>{`${product?.user?.firstName} ${product?.user?.lastName}`}</td>
                                    <td>
                                        <img
                                            alt={`product-${product.id}`}
                                            src={product.image}
                                            style={imageStyles}
                                        />
                                    </td>
                                    <td>{product.title}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        {isCurrentUserCreator && (
                                            <>
                                                <div className="btn-group mr-2">
                                                    <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                                                </div>
                                                <div className="btn-group mr-2">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(product.id)}>Delete</button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </Wrapper>
    );
}

export default withPermission(Products, 'viewProducts');
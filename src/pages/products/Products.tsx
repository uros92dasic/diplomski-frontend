import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { Product } from "../../models/product";
import withPermission from "../../permissions/withPermission";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";
import { useDispatch } from "react-redux";

const Products = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;

    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get(`products?page=${page}`);

                setProducts(data.data);
                setLastPage(data.meta.lastPage);
            }
        )();
    }, [page]);

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

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <Link to={'/products/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">User</th>
                            <th scope="col">image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Price</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: Product) => {
                            const isCurrentUserCreator = product?.user?.id === currentUserId;
                            return (
                                <tr key={product.id}>
                                    <td>{`${product?.user?.firstName} ${product?.user?.lastName}`}</td>
                                    <td><img alt={`product-${product.id}`} src={product.image} width="50" /></td>
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

            <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
        </Wrapper>
    );
}

export default withPermission(Products, 'viewProducts');
import React, { useEffect, useState } from "react";
import { Product } from "../../models/product";
import axios from "axios";
import Paginator from "../../components/Paginator";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../../redux/actions/setProductSearchAction";

interface Props {
    show: boolean;
    onHide: () => void;
    onSelect: (product: Product) => void;
}

const SelectProductModal: React.FC<Props> = ({ show, onHide, onSelect }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;

    const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`products/orders?page=${page}&userId=${currentUserId}&search=${searchTerm}`);
            setProducts(data.data);
            setLastPage(data.meta.lastPage);
        })();
    }, [page, currentUserId, searchTerm]);

    const handleProductSelect = (product: Product) => {
        dispatch(setSearchTerm(""));
        onSelect(product);
    };

    return (
        <div
            className={`modal ${show ? "d-block" : "d-none"}`}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select Product</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onHide}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <input
                            className="w-100 rounded-0"
                            style={{
                                border: "1px solid #ced4da",
                                padding: "0.375rem 0.75rem",
                                marginBottom: "1rem"
                            }}
                            type="text"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                            onBlur={(e) => e.target.value = searchTerm}
                        />
                        <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
                        <ul className="list-group">
                            {products.map((product) => (
                                <li
                                    key={product.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    onClick={() => handleProductSelect(product)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img alt={`product-${product.id}`} src={product.image} width="50" />
                                    {product.title}
                                    <span className="badge bg-primary rounded-pill">
                                        {product.price}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectProductModal;

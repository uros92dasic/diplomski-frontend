import React, { useEffect, useState } from "react";
import { Product } from "../../models/product";
import axios from "axios";
import Paginator from "../../components/Paginator";

interface Props {
    show: boolean;
    onHide: () => void;
    onSelect: (product: Product) => void;
}

const SelectProductModal: React.FC<Props> = ({ show, onHide, onSelect }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`products?page=${page}`);
            setProducts(data.data);
            setLastPage(data.meta.lastPage);
        })();
    }, [page]);

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
                        <ul className="list-group">
                            {products.map((product) => (
                                <li
                                    key={product.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    onClick={() => onSelect(product)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img alt={`product-${product.id}`} src={product.image} width="50" />
                                    {product.title}
                                    <span className="badge bg-primary rounded-pill">
                                        {product.id}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
                </div>
            </div>
        </div>
    );
};

export default SelectProductModal;

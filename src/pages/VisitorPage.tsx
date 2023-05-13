import React, { CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Product } from "../models/product";
import Paginator from "../components/Paginator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { setSearchTerm } from "../redux/actions/setProductSearchAction";


const tableStyles = {
    counterColumnWidth: "5%",
    imageColumnWidth: "20%",
    titleColumnWidth: "25%",
    descriptionColumnWidth: "40%",
    priceColumnWidth: "10%",
};

const imageStyles: CSSProperties = {
    width: '55px',
    height: '55px',
    objectFit: 'fill' as 'fill',
};

const VisitorPage = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

    const auth = useAuth();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const navigate = useNavigate();

    if (!auth) {
        throw new Error("Auth context is not provided.");
    }

    const { isLoggedIn } = auth;

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get(`products?page=${page}&search=${searchTerm}`);

                setProducts(data.data);
                setLastPage(data.meta.lastPage);
            }
        )();
    }, [page, searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const counter = (page - 1) * 10 + 1;

    return (
        <>
            <>
                <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/visitor-page">
                        Online shop app
                    </a>
                    <button
                        className="navbar-toggler position-absolute d-md-none collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu"
                        aria-controls="sidebarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <input
                        className="form-control form-control-dark w-100 rounded-0 border-0"
                        type="text"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        onBlur={(e) => e.target.value = searchTerm}
                    />
                    <div className="navbar-nav">
                        <div className="nav-item text-nowrap">
                            <Link to="/login" className="nav-link px-3 text-decoration-none">
                                Login
                            </Link>

                            <Link to="/register" className="nav-link px-3 text-decoration-none">
                                Register
                            </Link>
                        </div>
                    </div>
                </header>
            </>

            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                        <div className="position-sticky px-3 mt-3 pt-3 sidebar-sticky">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    List of all the products
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ width: tableStyles.counterColumnWidth }}>#</th>
                                        <th style={{ width: tableStyles.imageColumnWidth }}>Image</th>
                                        <th style={{ width: tableStyles.titleColumnWidth }}>Title</th>
                                        <th style={{ width: tableStyles.descriptionColumnWidth }}>Description</th>
                                        <th style={{ width: tableStyles.priceColumnWidth }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product: Product, index: number) => {
                                        return (
                                            <tr key={product.id}>
                                                <td>{counter + index}</td>
                                                <td><img
                                                    alt={`product-${product.id}`}
                                                    src={product.image}
                                                    style={imageStyles}
                                                /></td>
                                                <td>{product.title}</td>
                                                <td>{product.description}</td>
                                                <td>{product.price}</td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
                        </div>

                        <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
                    </main>
                </div>
            </div>
        </>
    );
}

export default VisitorPage;
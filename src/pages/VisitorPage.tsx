import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Product } from "../models/product";
import Paginator from "../components/Paginator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VisitorPage = () => {
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
                const { data } = await axios.get(`products?page=${page}`);

                setProducts(data.data);
                setLastPage(data.meta.lastPage);
            }
        )();
    }, [page]);

    return (
        <>
            <>
                <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/">
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
                                        <th scope="col">image</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product: Product) => {
                                        return (
                                            <tr key={product.id}>
                                                <td><img alt={`product-${product.id}`} src={product.image} width="50" /></td>
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
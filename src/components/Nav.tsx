import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { getUserName } from "../models/user";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/actions/setUserAction";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const auth = useAuth();

    if (!auth) {
        throw new Error("Auth context is not provided.");
    }

    const { setIsLoggedIn } = auth;

    const logout = async () => {
        await axios.post("logout", {});
        dispatch(clearUser());
        setIsLoggedIn(false);
    };

    return (
        <>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/">
                    Online store app
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
                        <Link to="/profile" className="nav-link px-3 text-decoration-none">
                            {getUserName(user)}
                        </Link>

                        <Link
                            to="/login"
                            className="nav-link px-3 text-decoration-none"
                            onClick={logout}
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Nav;

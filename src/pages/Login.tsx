import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios, { AxiosError } from 'axios';
import { Link } from "react-router-dom";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../components/messages/Messages";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const auth = useAuth();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    if (!auth) {
        throw new Error("Auth context is not provided.");
    }

    const { isLoggedIn } = auth;

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, []);

    const { setIsLoggedIn } = auth;

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post("login", {
                email,
                password,
            });
            setIsLoggedIn(true);
            dispatch(showSuccessMessage("Login successful."));
            setRedirect(true);
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                dispatch(showErrorMessage(axiosError.response.data.message));
            } else {
                dispatch(showErrorMessage("Error while trying to login."));
            }
        }
    }

    if (redirect) {
        return <Navigate replace to={'/'} />
    }

    return (
        <main className="form-signin w-100 m-auto">
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Login</h1>

                <input type="email" className="form-control" placeholder="name@example.com" required
                    onChange={e => setEmail(e.target.value)}
                />

                <input type="password" className="form-control" placeholder="Password" required
                    onChange={e => setPassword(e.target.value)}
                />

                <button className="w-100 btn btn-lg btn-primary" type="submit">Login</button>
                <Link className="w-100 btn btn-lg btn-secondary mt-2" to="/register">Register</Link>
            </form>
            <div className="mt-3 text-center">
                <Link to="/visitor-page" className="small-link">Visitor page</Link>
            </div>
        </main>
    );
}

export default Login;
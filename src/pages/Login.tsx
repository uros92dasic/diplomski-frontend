import React, { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import axios, { AxiosError } from 'axios';
import { Link } from "react-router-dom";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../components/messages/Messages";
import { useDispatch } from "react-redux";

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post("login", {
                email,
                password,
            });

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
        </main>
    );
}

export default Login;
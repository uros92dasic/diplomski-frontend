import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Menu from "./Menu";
import Nav from "./Nav";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/setUserAction";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface AxiosError extends Error {
    response?: {
        status: number;
    };
}

type WrapperProps = {
    children: React.ReactNode;
};

const Wrapper = (props: WrapperProps) => {
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    const auth = useAuth();

    if (!auth) {
        throw new Error("Auth context is not provided.");
    }

    const { isLoggedIn } = auth;

    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                try {
                    const { data } = await axios.get("user");
                    dispatch(
                        setUser({
                            id: data.id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            role: data.role,
                        })
                    );
                } catch (e) {
                    const axiosError = e as AxiosError;
                    if (axiosError.response && axiosError.response.status === 403) {
                        setRedirect(true);
                    } else {
                        console.error(e);
                    }
                }
            }
        })();
    }, [dispatch, isLoggedIn]);

    if (redirect) {
        return <Navigate replace to={"/login"} />;
    }

    return (
        <>
            <Nav />

            <div className="container-fluid">
                <div className="row">
                    <Menu />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {props.children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Wrapper;

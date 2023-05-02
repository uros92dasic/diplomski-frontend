import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Menu from "./Menu";
import Nav from "./Nav";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/actions/setUserAction";
import { RootState } from "../redux/reducers";
import axios from "axios";

type WrapperProps = {
    children: React.ReactNode;
};

const Wrapper = (props: WrapperProps) => {
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch(); // Get the dispatch function from Redux
    const user = useSelector((state: RootState) => state.user.user); // Get the user from the Redux state 

    useEffect(() => {
        (async () => {
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
                setRedirect(true);
            }
        })();
    }, [dispatch]);

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

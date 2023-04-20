import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Menu from "./Menu";
import Nav from "./Nav";

type WrapperProps = {
    children: React.ReactNode;
};

const Wrapper = (props: WrapperProps) => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        (
            async () => {
                try {
                    await axios.get('user');
                } catch (e) {
                    setRedirect(true);
                }
            }
        )();
    }, []);

    if (redirect) {
        return <Navigate replace to={'/login'} />;
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
}

export default Wrapper;
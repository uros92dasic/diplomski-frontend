import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux/reducers";

const Menu = () => {
    const user = useSelector((state: RootState) => state.user.user);

    const userPermissions = user?.role?.rolePermissions?.map(rp => rp.permission.name) || [];

    const hasPermission = (permission: string) => {
        return userPermissions.includes(permission);
    };

    return (
        <>
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div className="position-sticky pt-3 sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink to={"/"} className="nav-link">
                                Dashboard
                            </NavLink>
                        </li>
                        {hasPermission("viewUsers") && (
                            <li className="nav-item">
                                <NavLink to={"/users"} className="nav-link">
                                    Users
                                </NavLink>
                            </li>
                        )}
                        {hasPermission("viewRoles") && (
                            <li className="nav-item">
                                <NavLink to={"/roles"} className="nav-link">
                                    Roles
                                </NavLink>
                            </li>
                        )}
                        {hasPermission("viewProducts") && (
                            <li className="nav-item">
                                <NavLink to={"/products"} className="nav-link">
                                    Products
                                </NavLink>
                            </li>
                        )}
                        {hasPermission("viewOrders") && (
                            <li className="nav-item">
                                <NavLink to={"/orders"} className="nav-link">
                                    Orders
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Menu;

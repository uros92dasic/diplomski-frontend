import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/user";
import withPermission from "../../permissions/withPermission";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";
import "../../App.css";

const tableStyles = {
    counterColumnWidth: "5%",
    nameColumnWidth: "25%",
    emailColumnWidth: "25%",
    roleColumnWidth: "25%",
    actionColumnWidth: "20%",
};

const Users = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;

    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`users?page=${page}`);
                setUsers(data.data); //data.data because they are paginated
                setLastPage(data.meta.lastPage);
            } catch (error) {
                const axiosError = error as AxiosError;

                if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                    dispatch(showErrorMessage(axiosError.response.data.message));
                } else {
                    dispatch(showErrorMessage("Error while fetching users."));
                }
            }
        })();
    }, [page, dispatch]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`users/${id}`);
                setUsers(users.filter((u: User) => u.id !== id));
                dispatch(showSuccessMessage("User deleted successfully."));
            } catch (error) {
                const axiosError = error as AxiosError;

                if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                    dispatch(showErrorMessage(axiosError.response.data.message));
                } else {
                    dispatch(showErrorMessage("Error while deleting user."));
                }
            }
        }
    };

    const counter = (page - 1) * 10 + 1;

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <div className="header-controls">
                    <div className="pt-3">
                        <Link to={'/users/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
                    </div>
                    <div className="paginator-container">
                        <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)} />
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: tableStyles.counterColumnWidth }}>
                                #
                            </th>
                            <th scope="col" style={{ width: tableStyles.nameColumnWidth }}>
                                Name
                            </th>
                            <th scope="col" style={{ width: tableStyles.emailColumnWidth }}>
                                Email
                            </th>
                            <th scope="col" style={{ width: tableStyles.roleColumnWidth }}>
                                Role
                            </th>
                            <th scope="col" style={{ width: tableStyles.actionColumnWidth }}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: User, index: number) => {
                            const isCurrentUserCreator = user.id === currentUserId;
                            return (
                                <tr key={user.id}>
                                    <td>{counter + index}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role.name}</td>
                                    <td>
                                        {!isCurrentUserCreator && (
                                            <div className="btn-group mr-2">
                                                <Link to={`/users/${user.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                                            </div>
                                        )}
                                        {!isCurrentUserCreator && (
                                            <div className="btn-group mr-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(user.id)}>Delete</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Wrapper>
    )
}

export default withPermission(Users, 'viewUsers');
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { Role } from "../../models/role";
import withPermission from "../../permissions/withPermission";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";

const Roles = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserRoleId = currentUser?.role.id;

    const dispatch = useDispatch();

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get('roles');

                setRoles(data.data);
            }
        )();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await axios.delete(`roles/${id}`);
                setRoles(roles.filter((r: Role) => r.id !== id))
                dispatch(showSuccessMessage("Role deleted successfully."));
            } catch (error) {
                const axiosError = error as AxiosError;

                if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                    dispatch(showErrorMessage(axiosError.response.data.message));
                } else {
                    dispatch(showErrorMessage("Error while deleting user."));
                }
            }
        }
    }

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <Link to={'/roles/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role: Role) => {
                            const isCurrentRoleCreator = role.id === currentUserRoleId;
                            return (
                                <tr key={role.id}>
                                    <td>{role.name}</td>
                                    <td>
                                        {!isCurrentRoleCreator && (
                                            <div className="btn-group mr-2">
                                                <Link to={`/roles/${role.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                                            </div>
                                        )}
                                        {!isCurrentRoleCreator && (
                                            <div className="btn-group mr-2">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(role.id)}>Delete</button>
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
    );
}

export default withPermission(Roles, 'viewRoles');
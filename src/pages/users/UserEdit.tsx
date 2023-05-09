import axios, { AxiosError } from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { Role } from "../../models/role";
import withPermission from "../../permissions/withPermission";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";
import { useDispatch } from "react-redux";

const UserEdit = () => {
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await axios.get('roles');

                    setRoles(response.data.data);

                    const { data } = await axios.get(`users/${id}`);

                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                    setRoleId(data.roleId);
                } catch (error) {
                    const axiosError = error as AxiosError;

                    if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                        dispatch(showErrorMessage(axiosError.response.data.message));
                    } else {
                        dispatch(showErrorMessage("Error while fetching user data"));
                    }
                }
            }
        )();
    }, [id, dispatch]);


    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.patch(`users/${id}`, {
                firstName,
                lastName,
                email,
                roleId
            });

            setRedirect(true);
            dispatch(showSuccessMessage("User updated successfully."));
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                dispatch(showErrorMessage(axiosError.response.data.message));
            } else {
                dispatch(showErrorMessage("Error while updating user"));
            }
        }
    }


    if (redirect) {
        return <Navigate replace to={'/users'} />;
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>First Name</label>
                    <input className="form-control"
                        defaultValue={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Last Name</label>
                    <input className="form-control"
                        defaultValue={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control"
                        defaultValue={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Role</label>
                    <select className="form-control"
                        value={roleId}
                        onChange={e => setRoleId(e.target.value)}>
                        {roles.map((r: Role) => {
                            return (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            )
                        })}
                    </select>
                </div>

                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </Wrapper>
    );
}

export default withPermission(UserEdit, 'editUsers');
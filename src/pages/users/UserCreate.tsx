import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { Role } from "../../models/role";

const UserCreate = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get('roles');

                setRoles(data.data);
            }
        )();
    }, []);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await axios.post('users', {
            firstName,
            lastName,
            email,
            roleId
        });

        setRedirect(true);
    }

    if (redirect) {
        return <Navigate replace to={'/users'} />;
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>First Name</label>
                    <input className="form-control" onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Last Name</label>
                    <input className="form-control" onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label>Role</label>
                    <select className="form-control" onChange={e => setRoleId(e.target.value)} value={roleId}>
                        <option value="">Select a role</option>
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

export default UserCreate;
import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { Permission } from "../../models/permission";
import { RolePermission } from "../../models/rolePermission";
import withPermission from "../../permissions/withPermission";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";

const RoleEdit = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([] as number[]);
    const [redirect, setRedirect] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        (
            async () => {
                const response = await axios.get('permissions');

                setPermissions(response.data);

                const { data } = await axios.get(`roles/${id}`);

                setName(data.name);
                setSelected(data.rolePermissions.map((p: RolePermission) => p.permission.id));
            }
        )();
    }, [id]);

    const handleCheck = (id: number) => {
        if (selected.some(s => s === id)) {
            setSelected(selected.filter(s => s !== id));
            return;
        }
        setSelected([...selected, id]);

    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.patch(`roles/${id}`, {
                name,
                permissions: selected
            });

            setRedirect(true);
            dispatch(showSuccessMessage("Role updated successfully."));
        } catch (error) {
            dispatch(showErrorMessage("Error while updating role."));
        }
    }

    if (redirect) {
        return <Navigate replace to={'/roles'} />;
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Role Name</label>
                    <input className="form-control"
                        defaultValue={name}
                        onChange={e => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="col-sm-2 col-form-label">Permissions</label>
                    <div className="col-sm-10">
                        {permissions.map((p: Permission) => {
                            return (
                                <div className="form-check form-check-inline col-4" key={p.id}>
                                    <input className="form-check-input" type={'checkbox'}
                                        value={p.id}
                                        checked={selected.some(s => s === p.id)}
                                        onChange={() => { handleCheck(p.id) }}
                                    />
                                    <label className="form-check-label">{p.name}</label>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </Wrapper>
    );
}

export default withPermission(RoleEdit, 'editRoles');
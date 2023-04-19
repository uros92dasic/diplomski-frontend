import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paginator from "../../components/Paginator";
import Wrapper from "../../components/Wrapper";
import { User } from "../../models/user";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    useEffect(()=>{
        (
            async () => {
                const {data} = await axios.get(`users?page=${page}`);

                //console.log(data);
                setUsers(data.data); //data.data because they are paginated
                setLastPage(data.meta.lastPage);
            }
        )();
    }, [page])

    const handleDelete = async (id: number) => {
        if(window.confirm('Are you sure you want to delete this record?')) {
            await axios.delete(`users/${id}`);

            setUsers(users.filter((u: User) => u.id !== id))
        }
    }

    return (
        <Wrapper>
            <div className="pt-3 pb-2 mb-3 border-bottom">
                <Link to={'/users/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: User)=>{
                        return (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role.name}</td>
                                <td>
                                    <div className="btn-group mr-2">
                                        <Link to={`/users/${user.id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                                    </div>
                                    <div className="btn-group mr-2">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>

            <Paginator page={page} lastPage={lastPage} pageChanged={page => setPage(page)}/>
        </Wrapper>
    )
}

export default Users;
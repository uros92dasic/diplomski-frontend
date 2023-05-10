import React, { SyntheticEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios, { AxiosError } from "axios";
import Wrapper from "../components/Wrapper";
import { User } from "../models/user";
import { setUser } from "../redux/actions/setUserAction";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../components/messages/Messages";

const Profile = () => {
    const dispatch = useDispatch();
    const user: User = useSelector((state: any) => state.user);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(true);

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        (async () => {
            if (!user.email) {
                const { data } = await axios.get("user");
                dispatch(setUser(data));

                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
            } else {
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
            }
            setLoading(false);
        })();
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        checkFormValidity();
        // eslint-disable-next-line
    }, [password, passwordConfirm]);

    const checkFormValidity = () => {
        setIsFormValid(password.trim() !== "" && passwordConfirm.trim() !== "" && password === passwordConfirm);
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.patch("users/info", {
                firstName,
                lastName,
                email,
            });

            dispatch(setUser(data));
            dispatch(showSuccessMessage("Info updated successfully."));
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                dispatch(showErrorMessage(axiosError.response.data.message));
            } else {
                dispatch(showErrorMessage("Error while updating user info."));
            }
        }
    };


    const handlePassword = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.patch("users/password", {
                password,
                passwordConfirm,
            });

            dispatch(showSuccessMessage("Password updated successfully."));
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.data && isErrorResponse(axiosError.response.data)) {
                dispatch(showErrorMessage(axiosError.response.data.message));
            } else {
                dispatch(showErrorMessage("Error while updating user password."));
            }
        }
    };

    return (
        <Wrapper>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h3>Account Information</h3>
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
                        {/* <div className="mb-3">
                            <label>Email</label>
                            <input className="form-control"
                                defaultValue={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div> */}

                        <button className="btn btn-outline-secondary">Save</button>
                    </form>

                    <h3 className="mt-4">Change Password</h3>
                    <form onSubmit={handlePassword}>
                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password Confirm</label>
                            <input type="password" className="form-control"
                                onChange={e => setPasswordConfirm(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-outline-secondary" disabled={!isFormValid}>Save</button>
                    </form></>
            )}
        </Wrapper>
    );
}

export default Profile;
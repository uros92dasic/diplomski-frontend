import React, { Component, SyntheticEvent } from 'react';
import { Navigate } from 'react-router-dom';
import axios, { AxiosError } from "axios";
import '../Login.css';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from "react-redux";
import { isErrorResponse, showErrorMessage, showSuccessMessage } from "../components/messages/Messages";
import { AuthContext } from '../context/AuthContext';

const mapDispatchToProps = {
    showSuccessMessage,
    showErrorMessage
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

class Register extends Component<PropsFromRedux> {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    passwordConfirm = '';
    roleId = 2;
    state = {
        redirect: false
    };

    submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post('register', {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                passwordConfirm: this.passwordConfirm,
                roleId: 2
            });

            this.props.showSuccessMessage("Registration successful! You can now login.");
            this.setState({
                redirect: true
            });
        } catch (error) {
            const axiosError = error as AxiosError;

            if (
                axiosError.response &&
                axiosError.response.data &&
                isErrorResponse(axiosError.response.data)
            ) {
                this.props.showErrorMessage(axiosError.response.data.message);
            } else {
                this.props.showErrorMessage("Error while creating user.");
            }
        }
    }

    render() {
        if (this.state.redirect) {
            return <Navigate replace to={"/login"} />;
        }

        return (
            <AuthContext.Consumer>
                {(auth) => {
                    if (!auth) {
                        throw new Error("Auth context is not provided.");
                    }

                    const { isLoggedIn } = auth;

                    if (isLoggedIn) {
                        return <Navigate replace to="/" />;
                    }

                    return (
                        <main className="form-signin w-100 m-auto">
                            <form onSubmit={this.submit}>
                                <h1 className="h3 mb-3 fw-normal">Register</h1>

                                <input className="form-control" placeholder="First Name" required
                                    onChange={e => this.firstName = e.target.value}
                                />

                                <input className="form-control" placeholder="Last Name" required
                                    onChange={e => this.lastName = e.target.value}
                                />

                                <input type="email" className="form-control" placeholder="name@example.com" required
                                    onChange={e => this.email = e.target.value}
                                />

                                <input type="password" className="form-control" placeholder="Password" required
                                    onChange={e => this.password = e.target.value}
                                />

                                <input type="password" className="form-control" placeholder="Password Confirm" required
                                    onChange={e => this.passwordConfirm = e.target.value}
                                />

                                <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
                                <Link className="w-100 btn btn-lg btn-secondary mt-2" to="/login">Login</Link>
                            </form>
                            <div className="mt-3 text-center">
                                <Link to="/visitor-page" className="small-link">Visitor page</Link>
                            </div>
                        </main>
                    );
                }}
            </AuthContext.Consumer>
        );
    }

}

export default connector(Register);

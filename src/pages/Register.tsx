import React, { Component, SyntheticEvent } from 'react';
import '../Login.css';

//the only example of class components in the project
class Register extends Component {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    passwordConfirm = '';

    submit = (e: SyntheticEvent) => {
        e.preventDefault();

        console.log({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            passwordConfirm: this.passwordConfirm
        })
    }

    render() {
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

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                </form>
            </main>
        );
    }
}

export default Register;
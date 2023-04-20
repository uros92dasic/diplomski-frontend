import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Users from './pages/users/Users';
import UserCreate from './pages/users/UserCreate';
import UserEdit from './pages/users/UserEdit';
import Roles from './pages/roles/Roles';
import RoleCreate from './pages/roles/RoleCreate';
import RoleEdit from './pages/roles/RoleEdit';
import Products from './pages/products/Products';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Dashboard />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/users"} element={<Users />} />
          <Route path={"/users/create"} element={<UserCreate />} />
          <Route path={"/users/:id/edit"} element={<UserEdit />} />
          <Route path={"/roles"} element={<Roles />} />
          <Route path={"/roles/create"} element={<RoleCreate />} />
          <Route path={"/roles/:id/edit"} element={<RoleEdit />} />
          <Route path={"/products"} element={<Products />} />
          <Route path={"/products/create"} element={<ProductCreate />} />
          <Route path={"/products/:id/edit"} element={<ProductEdit />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/reducers';

const withPermission = (WrappedComponent: React.FC, requiredPermission: string) => {
    const WithPermission: React.FC = (props) => {
        const user = useSelector((state: RootState) => state.user.user);

        const userPermissions = user?.role?.rolePermissions?.map(rp => rp.permission.name) || [];

        const hasPermission = (permission: string) => {
            return userPermissions.includes(permission);
        };

        return user && hasPermission(requiredPermission) ? (
            <WrappedComponent {...props} />
        ) : (
            <Navigate to="/" />
        );
    };

    return WithPermission;
};

export default withPermission;

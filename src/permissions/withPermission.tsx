import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/reducers';
import { showErrorMessage } from '../components/messages/Messages';

const withPermission = (WrappedComponent: React.FC, requiredPermission: string) => {
    const WithPermission: React.FC = (props) => {

        const dispatch = useDispatch();
        const user = useSelector((state: RootState) => state.user.user);

        const userPermissions = user?.role?.rolePermissions?.map(rp => rp.permission.name) || [];

        const hasPermission = (permission: string) => {
            return userPermissions.includes(permission);
        };

        useEffect(() => {
            if (user && !hasPermission(requiredPermission)) {
                dispatch(showErrorMessage('Forbidden resource'));
            }
        }, [user, requiredPermission, dispatch]);

        return user && hasPermission(requiredPermission) ? (
            <WrappedComponent {...props} />
        ) : (
            <Navigate to="/" />
        );
    };

    return WithPermission;
};

export default withPermission;

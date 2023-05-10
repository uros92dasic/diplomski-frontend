import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMessageState, selectMessageOptions } from '../../redux/slices/messageSlice';
import { hideMessage } from '../../redux/slices/messageSlice';

const variantStyles: Record<string, string> = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-danger',
    info: 'alert-info',
};

function Message() {
    const dispatch = useDispatch();
    const state = useSelector(selectMessageState);
    const options = useSelector(selectMessageOptions);

    const handleClose = useCallback(() => {
        dispatch(hideMessage({}));
    }, [dispatch]);

    useEffect(() => {
        if (state) {
            const timeout = setTimeout(() => {
                handleClose();
            }, options.autoHideDuration);

            return () => clearTimeout(timeout);
        }
    }, [state, options.autoHideDuration, handleClose]);

    const alertVariant = variantStyles[options.variant || 'info'];

    if (!state) {
        return null;
    }

    return (
        <div className="position-fixed top-0 start-50 translate-middle-x" style={{ zIndex: 9999 }}>
            <div className={`alert ${alertVariant} alert-dismissible fade show`} role="alert">
                {options.message}
                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
        </div>

    );
}

export default memo(Message);

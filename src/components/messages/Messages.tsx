import { showMessage } from "../../redux/slices/messageSlice"

const showMessageWrapper = (message: string, variant: 'success' | 'error') => {
    return showMessage({
        message,
        autoHideDuration: 4000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        variant
    })
}

export const showSuccessMessage = (message: string) => {
    return showMessageWrapper(message, 'success')
}

export const showErrorMessage = (message: string) => {
    return showMessageWrapper(message, 'error')
}

export interface ErrorResponse {
    message: string;
}

export function isErrorResponse(data: any): data is ErrorResponse {
    return data.message !== undefined;
}

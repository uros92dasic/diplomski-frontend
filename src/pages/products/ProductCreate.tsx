import axios from "axios";
import React, { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import withPermission from "../../permissions/withPermission";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

const ProductCreate = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;

    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post('products', {
                image,
                title,
                description,
                price,
                userId: currentUserId
            });

            setRedirect(true);
            dispatch(showSuccessMessage("Product created successfully."));
        } catch (error) {
            dispatch(showErrorMessage("Error while creating product."));
        }
    }

    if (redirect) {
        return <Navigate replace to={'/products'} />;
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title</label>
                    <input className="form-control"
                        onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea className="form-control"
                        onChange={e => setDescription(e.target.value)}>
                    </textarea>
                </div>
                <div className="mb-3">
                    <label>Image</label>
                    <div className="input-group">
                        <input className="form-control"
                            value={image}
                            onChange={e => setImage(e.target.value)} />
                        <ImageUpload uploaded={setImage} />
                    </div>
                </div>
                <div className="mb-3">
                    <label>Price</label>
                    <input type="number" className="form-control"
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>

                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </Wrapper>
    );
}

export default withPermission(ProductCreate, 'editProducts');

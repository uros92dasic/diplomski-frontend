import axios from "axios";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import Wrapper from "../../components/Wrapper";
import withPermission from "../../permissions/withPermission";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { showErrorMessage, showSuccessMessage } from "../../components/messages/Messages";

const ProductEdit = () => {
    const currentUser = useSelector((state: RootState) => state.user.user);
    const currentUserId = currentUser?.id;
    const [unauthorized, setUnauthorized] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { id } = useParams();
    const ref = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        (
            async () => {
                const { data } = await axios.get(`products/${id}`);

                if (data.userId !== currentUserId) {
                    setUnauthorized(true);
                } else {
                    setTitle(data.title);
                    setDescription(data.description);
                    setImage(data.image);
                    setPrice(data.price);
                }
            }
        )();
    }, [id, currentUserId]);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.patch(`products/${id}`, {
                image,
                title,
                description,
                price
            });

            setRedirect(true);
            dispatch(showSuccessMessage("Product updated successfully."));
        } catch (error) {
            dispatch(showErrorMessage("Error while updating product."));
        }
    }

    const updateImage = (url: string) => {
        if (ref.current) {
            ref.current.value = url;
        }
        setImage(url);
    }

    if (redirect) {
        return <Navigate replace to={'/products'} />;
    }
    if (unauthorized) {
        return <Navigate replace to={'/products'} />;
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Title</label>
                    <input className="form-control"
                        defaultValue={title}
                        onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea className="form-control"
                        defaultValue={description}
                        onChange={e => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label>Image</label>
                    <div className="input-group">
                        <input className="form-control"
                            ref={ref}
                            defaultValue={image}
                            onChange={e => setImage(e.target.value)} />
                        <ImageUpload uploaded={updateImage} />
                    </div>
                </div>
                <div className="mb-3">
                    <label>Price</label>
                    <input type="number" className="form-control"
                        defaultValue={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>

                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </Wrapper>
    );
}

export default withPermission(ProductEdit, 'editProducts');
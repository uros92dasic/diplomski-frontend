import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { setUser } from "../../redux/actions/setUserAction";
import SelectProductModal from "./SelectProductModal";
import { Product } from "../../models/product";
import { OrderItem } from "../../models/orderItem";
import withPermission from "../../permissions/withPermission";

interface OrderProduct extends Omit<OrderItem, "id" | "productId" | "quantity"> {
    productId: string;
    quantity: string;
}

const OrderCreate = () => {
    const [products, setProducts] = useState<OrderProduct[]>([]);
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const [showProductModal, setShowProductModal] = useState(false);

    const handleProductSelect = (product: Product) => {
        setProducts((prevProducts) => [
            ...prevProducts,
            {
                productId: product.id.toString(),
                quantity: "1",
                product: product,
            },
        ]);
        setShowProductModal(false);
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("user");
                dispatch(
                    setUser({
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        role: data.role,
                    })
                );
            } catch (e) {
                setRedirect(true);
            }
        })();
    }, [dispatch]);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const orderItems = products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
        }));

        await axios.post("orders", {
            userId: user.id,
            products: orderItems,
        });

        setRedirect(true);
    };

    const handleProductChange = (index: number, key: "productId" | "quantity", value: string) => {
        const updatedProducts = products.map((product, idx) => {
            if (idx === index) {
                return { ...product, [key]: value };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, idx) => idx !== index));
    };

    if (redirect) {
        return <Navigate replace to={"/orders"} />;
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>User</label>
                    <p>{`${user.firstName} ${user.lastName} (${user.email})`}</p>
                </div>
                <SelectProductModal
                    show={showProductModal}
                    onHide={() => setShowProductModal(false)}
                    onSelect={handleProductSelect}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary mb-3"
                    onClick={() => setShowProductModal(true)}
                >
                    Select Product
                </button>
                {products.map((product, index) => (
                    <div key={index} className="mb-3">
                        <img src={product.product.image} alt={`product-${product.product.id}`} width="100" />
                        <h5>{product.product.title}</h5>
                        <p>{product.product.description}</p>
                        <div className="d-flex align-items-center">
                            <label className="me-2">Quantity</label>
                            <input
                                type="number"
                                className="form-control w-auto"
                                value={product.quantity}
                                onChange={e => handleProductChange(index, "quantity", e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-danger mt-2"
                            onClick={() => removeProduct(index)}
                        >
                            Remove Product
                        </button>
                    </div>
                ))}
                <button className="btn btn-outline-secondary">Save</button>
            </form>
        </Wrapper>
    );
};

export default withPermission(OrderCreate, 'editOrders');
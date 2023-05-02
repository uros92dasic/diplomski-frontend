import React from "react";

const Paginator = (props: { page: number, lastPage: number, pageChanged: (page: number) => void }) => {

    const handleNext = () => {
        if (props.page < props.lastPage) {
            props.pageChanged(props.page + 1);
        }
    }

    const handlePrevious = () => {
        if (props.page > 1) {
            props.pageChanged(props.page - 1)
        }
    }

    return (
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <button type="button" className="page-link" onClick={handlePrevious}>Previous</button>
                </li>
                <li className="page-item">
                    <button type="button" className="page-link" onClick={handleNext}>Next</button>
                </li>
            </ul>
        </nav>
    );
}

export default Paginator;
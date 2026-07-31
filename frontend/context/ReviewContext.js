import { createContext, useState } from "react";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
    const [ reviewItems, setReviewItems ] = useState([]);

    return (
        <ReviewContext.Provider value={{ reviewItems, setReviewItems }}>
            {children}
        </ReviewContext.Provider>
    );
}

export default ReviewContext;
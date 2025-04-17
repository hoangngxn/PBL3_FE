import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const CommentContext = createContext();

export const useAppContext = () => {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error("useAppContext must be used within a CommentProvider");
    }
    return context;
};

export const CommentProvider = ({ children }) => {
    const [replyStatus, setReplyStatus] = useState(null);

    const value = {
        replyStatus,
        setReplyStatus,
    };

    return (
        <CommentContext.Provider value={value}>
            {children}
        </CommentContext.Provider>
    );
};

// Add prop validation for 'children'
CommentProvider.propTypes = {
    children: PropTypes.node,
};


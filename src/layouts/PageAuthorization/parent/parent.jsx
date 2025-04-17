import PropTypes from 'prop-types';
import Error from "../../../pages/error/error"

import { useAppContext } from '../../../AppProvider';
const Parent = ({ children }) => {
    const { role } = useAppContext();
    return (
        <>
            {
                role !== 'parent' ?
                    (
                        <Error />
                    )
                    :
                    (
                        children
                    )
            }
        </>

    )
}

Parent.propTypes = {
    children: PropTypes.node,
};
export default Parent;
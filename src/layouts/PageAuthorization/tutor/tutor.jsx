import PropTypes from 'prop-types';
import Error from "../../../pages/error/error"

import { useAppContext } from '../../../AppProvider';
const Tutor = ({ children }) => {
    const { role } = useAppContext();
    return (
        <>
            {
                role !== 'tutor' ?
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

Tutor.propTypes = {
    children: PropTypes.node,
};
export default Tutor;
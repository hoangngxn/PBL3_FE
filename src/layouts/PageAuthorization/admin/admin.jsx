import PropTypes from 'prop-types';
import Error from "../../../pages/error/error"

import { useAppContext } from '../../../AppProvider';
const Admin = ({ children }) => {
    const { role } = useAppContext();
    console.log(role)
    return (
        <>
            {
                role !== 'admin' ?
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

Admin.propTypes = {
    children: PropTypes.node,
};
export default Admin;
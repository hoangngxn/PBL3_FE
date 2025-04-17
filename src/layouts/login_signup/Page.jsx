import PropTypes from 'prop-types';

import Image from '../../assets/image/image_main.png'
const Page = ({ children }) => {
    return (
        <div
            style={{
                backgroundImage: `url(${Image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '80%',
                margin: '0 auto',
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    zIndex: 0,
                }}
            />
            <div style={{
                zIndex: 1, position: 'absolute', width: '80%',
                margin: '0 auto', left: '50%',
                transform: 'translate(-50%,10%)',
            }}>
                {children}
            </div>

        </div>
    )
}

Page.propTypes = {
    children: PropTypes.node,
};

export default Page
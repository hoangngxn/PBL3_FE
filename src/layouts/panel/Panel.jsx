import PropTypes from 'prop-types';
import Sidebar from "../sidebar/sidebar";

const Panel = ({ children, activeItem }) => {
  return (
    <div className="flex -mt-4">
      <Sidebar activeItem={activeItem} />

      <div className="flex-1 p-6">
        <div className="bg-gray-200 min-h-[600px] p-4 rounded-lg mb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

Panel.propTypes = {
  children: PropTypes.node,
  activeItem: PropTypes.number
};

export default Panel;
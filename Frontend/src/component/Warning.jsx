import React from 'react';
import { Link } from 'react-router-dom';

const Warning = ({ label, navigate }) => {
  return (
    <div>
      {/* Using a span instead of div inside the p tag */}
      <p>
        {label}{' '}
        <Link to={`/${navigate}`} className="text-blue-500 hover:underline">
          Click here
        </Link>
      </p>
    </div>
  );
};

export default Warning;

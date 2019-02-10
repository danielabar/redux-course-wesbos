import React from 'react';
import { Link } from 'react-router';

// This is the parent view
const Main = React.createClass({
  render() {
    return (
      <div>
        <h1>
          <Link to="/">Reduxstagram</Link>
        </h1>
        {/* Child view goes here */}
        {React.cloneElement(this.props.children, this.props)}
      </div>
    );
  },
});

export default Main;

import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="large">Developers Connect Here</h1>
          <p className="lead">
            Create a developer profile, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Landing
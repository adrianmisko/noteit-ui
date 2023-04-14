import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@material-ui/core';
import './style.css';

const Unauthorized: FC = () => (
  <Container>
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404" />
        <h2>You are not authorized to view this page</h2>
        <p>
          Sorry but you are not authorized to view this page. Ensure you have appropriate permissions or in case you are
          not logged in - log in.
        </p>
        <Link to="/projects">Unauthorized</Link>
      </div>
    </div>
  </Container>
);

export default Unauthorized;

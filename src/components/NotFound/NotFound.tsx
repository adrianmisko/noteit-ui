import React, { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './style.css';

const NotFound: FC<RouteComponentProps> = ({ history }: RouteComponentProps) => (
  <div id="notfound">
    <div className="notfound">
      <div className="notfound-404" />
      <h1>404</h1>
      <h2>Oops! Page Was Not Found</h2>
      <p>
        Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily
        unavailable
      </p>
      <a onClick={() => history.goBack()}>
        Go back
      </a>
    </div>
  </div>
);

export default withRouter(NotFound);

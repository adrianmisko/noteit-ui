import React, { FC } from 'react';
import { Redirect } from 'react-router';
import { useStoreActions } from '../store/hooks';
import HOSTNAME from '../config';

const CyLogIn: FC = () => {
  const logUserIn = useStoreActions(actions => actions.userModel.logUserIn);

  const url = `${HOSTNAME}/sandbox/test-user-token`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  };

  fetch(url, options).then(res => {
    if (res.status === 200) {
      res.text().then(token => {
        logUserIn(token);
        return <Redirect to="/projects" />;
      });
    }
  });

  return <Redirect to="/projects" />
};

export default CyLogIn;

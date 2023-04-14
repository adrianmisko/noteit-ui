import React, { FC } from 'react';
import { Redirect } from 'react-router';
import { useStoreActions } from './store/hooks';

const ExtractToken: FC = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const logUserIn = useStoreActions(actions => actions.userModel.logUserIn);

  if (token) {
    logUserIn(token);
  }

  return <Redirect to="/projects" />;
};

export default ExtractToken;

import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import CssBaseline from '@material-ui/core/CssBaseline';

import { StoreProvider } from 'easy-peasy';
import Navbar from './components/Navbar/Navbar';
import Workspace from './Workspace/Workspace';
import ProjectsView from './Project/ProjectsView';
import ProjectView from './Project/ProjectView';

import store from './store/store';
import NotFound from './components/NotFound/NotFound';
import ExtractToken from './ExtractToken';
import Unauthorized from './components/Unauthorized/Unauthorized';

import './app.css';
import ReviewView from './Review/ReviewView';
import { makeStyles } from '@material-ui/core';
import CyLogIn from './__tests__/CyLogIn';

const useStyles = makeStyles(theme => ({
  spacing: {
    marginTop: '5em',
  },
}));

const App: FC = () => {
  const styles = useStyles();

  return (
    // @ts-ignore
    <PersistGate loading={<div>Loading</div>} persistor={persistStore(store)}>
      <StoreProvider store={store}>
        <CssBaseline />
        <Router>
          <Navbar />
          <div className={styles.spacing}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/projects" />
              </Route>
              <Route exact path="/unauthorized" component={Unauthorized} />
              <Route exact path="/extract-token" component={ExtractToken} />
              <Route exact path="/cy-log-in" component={CyLogIn} />
              <Route exact path="/projects" component={ProjectsView} />
              <Route exact path="/projects/:projectId" component={ProjectView} />
              <Route exact path="/projects/:projectId/:view" component={ProjectView} />
              <Route exact path="/projects/:projectId/workspace/:documentId" component={Workspace} />
              <Route exact path="/projects/:projectId/workspace/:documentId/review" component={ReviewView} />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </Router>
      </StoreProvider>
    </PersistGate>
  );
};

export default App;

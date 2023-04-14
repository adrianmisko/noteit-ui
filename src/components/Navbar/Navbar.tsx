import * as React from 'react';
import { Typography, AppBar, Toolbar, makeStyles, IconButton, Button, Avatar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link, useLocation } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../../store/hooks';
import * as config from '../../config';
// @ts-ignore
import GoogleLoginIcon from './icons/google-login-icon-24.jpg';
import { Redirect } from 'react-router';
import REDIRECT_URI from '../../config';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  loginButton: {
    width: 120,
    height: 30,
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'rgb(243, 243, 243)',
    },
  },
  toolbar: {
    width: '100%',
  },
  logo: {
    flexGrow: 1,
  },
  avatar: {
    width: 28,
    height: 25,
    marginLeft: -25,
    marginRight: 15,
  },
  link: {
    color: 'white',
  },
}));

const Navbar: React.FC = () => {
  const history = useHistory();
  const styles = useStyles();
  const location = useLocation();
  const toggleDrawerVisible = useStoreActions(actions => actions.workspaceModel.toggleDrawerVisible);
  const logUserOut = useStoreActions(actions => actions.userModel.logUserOut);
  const isLoggedIn = useStoreState(state => state.userModel.isLoggedIn);
  const project = useStoreState(state => state.projectModel.currentProject);
  const currentDocument = useStoreState(state => state.documentModel.currentDocument);
  const imageUrl = useStoreState(state => state.userModel.user.imageUrl);

  const logOut = () => {
    logUserOut();
    //const dupa = `https://accounts.google.com/Logout?continue=https://google.com`;
    //history.replace(dupa)
  }

  return (
    <div className={styles.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar className={styles.toolbar}>
          {location.pathname !== '/projects' ? (
            <Link
              className={styles.link}
              to={
                location.pathname.includes('review')
                  ? `/projects/${project ? project.id : ''}/workspace/${currentDocument ? currentDocument.id : ''}`
                  : location.pathname.includes('workspace')
                  ? `/projects/${project ? project.id : ''}`
                  : '/projects'
              }
            >
              <IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="back">
                <ArrowBackIcon />
              </IconButton>
            </Link>
          ) : null}
          {location.pathname.includes('workspace') && !location.pathname.includes('review') ? (
            <IconButton
              onClick={() => toggleDrawerVisible()}
              edge="start"
              className={styles.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography data-testid="logo" variant="h6" color="inherit" className={styles.logo}>
            NoteIT
          </Typography>
          {!isLoggedIn ? (
            <a href={`${config.HOSTNAME}/oauth2/authorize/google?redirect_uri=${config.REDIRECT_URI}/extract-token`}>
              <Button variant="outlined" focusRipple className={styles.loginButton}>
                <Avatar className={styles.avatar} src={GoogleLoginIcon} />
                Log in
              </Button>
            </a>
          ) : (
          <>
              <a
              href={`https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000`}
            >
              <Button style={{marginRight:"3vh"}} onClick={() => logOut()} variant="outlined" focusRipple className={styles.loginButton}>
                Log Out
              </Button>
            </a>
            <Avatar src={imageUrl} />
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;



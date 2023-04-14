import React, { FC, useEffect, useState, MouseEvent } from 'react';
import {
  Card,
  Grid,
  CardHeader,
  IconButton,
  CardMedia,
  Typography,
  makeStyles,
  Container,
  Fab,
  Modal,
  MenuItem,
  Menu,
} from '@material-ui/core';
import { MoreVert, Add } from '@material-ui/icons';
// @ts-ignore
import 'antd/dist/antd.css';
import { Link, Redirect } from 'react-router-dom';
// @ts-ignore
import KeyoardEventHandler from 'react-keyboard-event-handler';
import { useStoreState, useStoreActions } from '../store/hooks';
// @ts-ignore
import folderIcon from './icons/folder-blue.png';
import NewProjectForm from './NewProjectForm';
import Project from '../types/Project';
import Moment from 'react-moment';
import DialogConfirm from '../components/DialogConfirm/DialogConfirm';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '2em',
    overflow: 'scroll',
    height: '100vh',
  },
  card: {
    margin: '2em',
    maxWidth: 400,
    height: 340,
  },
  media: {
    height: 120,
    width: 120,
    margin: '16px auto',
  },
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    height: 75,
    width: 75,
    fontSize: 22,
  },
  link: {
    color: 'black',
  },
}));

// TODO tests
const ProjectsView: FC = () => {
  const styles = useStyles();

  const [newProjectFormVisible, setNewProjectFormVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [currentProject, setCurrentProject] = useState<number>(-1);

  const isLoggedIn = useStoreState(state => state.userModel.isLoggedIn);

  const projects = useStoreState(state => state.projectModel.projects);
  const addProjectThunk = useStoreActions(actions => actions.projectModel.addProject);
  const deleteProject = useStoreActions(actions => actions.projectModel.deleteProject);
  const fetchProjects = useStoreActions(actions => actions.projectModel.fetchProjects);
  const deleteDialogVisible = useStoreState(state => state.projectModel.deleteDialogVisible);
  const toggleDeleteDialogVisible = useStoreActions(actions => actions.projectModel.toggleDeleteDialogVisible);
  const projectRoles = useStoreState(state => state.userModel.user.projectRoles);
  const token = useStoreState(state => state.userModel.token);
  const getUserDetails = useStoreActions(actions => actions.userModel.getUserDetails);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects(1);
      getUserDetails(token);
    }
  }, []);

  const showNewProjectForm = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setNewProjectFormVisible(true);
  };

  const addProject = async (name: string) => {
    if (name.trim().length > 0) {
      await addProjectThunk({ id: 0, name, tags: [] });
      setNewProjectFormVisible(false);
      getUserDetails(token);
    }
  };

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>, projectId: number) => {
    if (projectRoles.map(pr => pr.projectId).includes(projectId)) {
      setCurrentProject(projectId);
      setAnchorEl(event.currentTarget as Element);
    }
  };

  const handleClose = () => {
    setCurrentProject(-1);
    setAnchorEl(null);
  };

  const deleteDocumentsButton = () => {
    toggleDeleteDialogVisible();
    setAnchorEl(null);
  }

  const handleDelete = () => {
    deleteProject(currentProject);
    setAnchorEl(null);
  };

  const more = (project: Project) => (
    <IconButton aria-label="settings" onClick={e => handleMenuClick(e, project.id)}>
      <MoreVert data-testid="moreHeader" />
    </IconButton>
  );

  const title = (project: Project) => (
    <Link data-testid="projectRedirect" className={styles.link} to={`/projects/${project.id}`}>
      {project.name}
    </Link>
  );

  if (!isLoggedIn) {
    return <Redirect to="/unauthorized" />;
  }

  const subheader = (_project: Project) => {
    return (
      <>
        <Typography variant="subtitle2" />
        Added <Moment locale="pl" format={"dddd, MMMM Do YYYY, h:mm"} date={_project.createdAt!!} />
        <Typography />
        <Typography variant="subtitle2" />
        Last update <Moment locale="pl" fromNow>{_project.updatedAt!!}</Moment>
        <Typography />
      </>
    );
  };

  return (
    <>
      {deleteDialogVisible ? <DialogConfirm projectId={currentProject} deleteProject={handleDelete} /> : <></>}
      <KeyoardEventHandler handleKeys={['alt+n']} onKeyEvent={showNewProjectForm} />
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={newProjectFormVisible}
        onClose={() => setNewProjectFormVisible(false)}
      >
        <NewProjectForm addProject={addProject} />
      </Modal>
      <Fab color="primary" aria-label="add" size="large" className={styles.fab} onClick={showNewProjectForm}>
        <Add style={{ fontSize: 44 }} data-testid="addProjectButton" />
      </Fab>
      <Container maxWidth="lg" data-testid="dupa">
        <Grid
          data-testid="projectsGrid"
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          className={styles.container}
        >
          <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={()=> deleteDocumentsButton()} data-testid="deleteButton">Delete the project</MenuItem>
          </Menu>
          {projects.map(project => (
            <Card className={styles.card}>
              <CardHeader data-testid="cardHeader" action={more(project)} title={title(project)} subheader={subheader(project)} />
              <Link to={`/projects/${project.id}`}>
                <CardMedia className={styles.media} image={folderIcon} title="Project icon" />
              </Link>
            </Card>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ProjectsView;

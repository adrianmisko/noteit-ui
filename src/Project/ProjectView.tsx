import React, { FC, useEffect, useState } from 'react';
// @ts-ignore
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
  Container,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  Snackbar,
  IconButton, Paper,
} from '@material-ui/core';
import { Description, SupervisorAccount, ListAlt, LabelOutlined, Close } from '@material-ui/icons';
import { Upload, message } from 'antd';
import 'antd/dist/antd.css';
import { useParams, Link, Redirect } from 'react-router-dom';
import Moment from 'react-moment';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// @ts-ignore
import { useStoreState, useStoreActions } from '../store/hooks';
import HOSTNAME from '../config';
import './projectView.css';
import Role from '../types/Role';
import Project from '../types/Project';

import { ProjectRole } from '../types/User';
import Navbar from '../components/Navbar/Navbar';
import DocumentList from '../components/DocumentList/DocumentList';
import ProjectUserList from '../components/ProjectUserList';
import DictionariesView from '../Dictionary/DictionariesView';
import TagList from '../components/TagList/TagList';
import Tag from '../types/Tag';
import DialogConfirm from '../components/DialogConfirm/DialogConfirm';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: 270,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 270,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  link: {
    color: 'black',
  },
}));

const ProjectView: FC = () => {
  const styles = useStyles();

  let { projectId } = useParams();
  projectId = Number(projectId);

  const [chosenTag, setChosenTag] = useState<Tag | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { view } = useParams();

  const emails = useStoreState(state => state.projectModel.emailsForSelect);
  const users = useStoreState(state => state.projectModel.users);
  const fetchEmails = useStoreActions(actions => actions.projectModel.getUsersForSelect);
  const addUsersToProject = useStoreActions(actions => actions.projectModel.addUsersToProject);

  const project = useStoreState(state => state.projectModel.currentProject);
  const documents = useStoreState(state => state.documentModel.documents);
  const isLoggedIn = useStoreState(state => state.userModel.isLoggedIn);
  const token = useStoreState(state => state.userModel.token);

  const currentUser = useStoreState(state => state.userModel.user);
  const { projectRoles } = currentUser;
  const { role } = projectRoles.find((pr: ProjectRole) => pr.projectId === projectId)!!;

  const deleteDocumentThunk = useStoreActions(actions => actions.documentModel.deleteDocument);
  const fetchDocuments = useStoreActions(actions => actions.documentModel.fetchDocuments);
  const fetchProject = useStoreActions(actions => actions.projectModel.fetchProject);
  const addDocumentsToList = useStoreActions(actions => actions.documentModel.addDocumentsToList);

  const removeUserFromProject = useStoreActions(actions => actions.projectModel.removeUserFromProject);
  const getUsers = useStoreActions(actions => actions.projectModel.getUsers);
  const changeRole = useStoreActions(actions => actions.projectModel.changeUsersRole);

  const documentsAnnotators = useStoreState(state => state.projectModel.documentAnnotators);
  const fetchDocumentsAnnotators = useStoreActions(actions => actions.projectModel.fetchDocumentsAnnotators);

  const tags = useStoreState(state => state.tagModel.tags);
  const saveTag = useStoreActions(actions => actions.tagModel.saveTag);
  const editTagAsync = useStoreActions(actions => actions.tagModel.editTag);
  const deleteTagAsync = useStoreActions(actions => actions.tagModel.deleteTag);
  const fetchTags = useStoreActions(actions => actions.tagModel.fetchTags);
  const dialogVisible = useStoreState(state => state.workspaceModel.dialogVisible);

  const documentWithConflicts = useStoreState(state => state.reviewModel.documentsWithConflicts);
  const fetchDocumentsWithConflicts = useStoreActions(actions => actions.reviewModel.fetchDocumentsWithConflicts);

  const resolvedDocuments = useStoreState(state => state.reviewModel.resolvedDocuments);
  const fetchResolvedDocuments = useStoreActions(actions => actions.reviewModel.fetchResolvedDocuments);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProject(projectId);
      fetchDocuments(projectId);
      getUsers(projectId);
      fetchDocumentsAnnotators(projectId);
      fetchTags(projectId);
      fetchDocumentsWithConflicts(projectId);
      fetchResolvedDocuments(projectId);
    }
  }, [projectId]);

  const addTag = (name: string, color: string) => {
    if (!tags.some(t => t.name === name)) {
      const tag = { id: 0, name, color };
      saveTag({ projectId, tag });
      return true;
    }
    setErrorMessage('Tag już istnieje');
    return false;
  };

  const editTag = (tagId: number, name: string) => {
    if (!tags.some(t => t.name === name)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const editedTag = tags.find(tag => tag.id === tagId)!!;
      editedTag.name = name;
      editTagAsync({ projectId, tag: editedTag });
      return true;
    }
    setErrorMessage('Tag już istnieje');
    return false;
  };

  const deleteTag = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tag = tags.find(t => t.id === (chosenTag ? chosenTag.id : 0))!!;
    deleteTagAsync({ projectId, tag });
  };

  const addDocumentProps = {
    name: 'documents',
    multiple: true,
    showUploadList: false,
    action: `${HOSTNAME}/api/projects/${projectId}/documents`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        addDocumentsToList(response);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleAddUsersToProject = (options: string[]) => {
    addUsersToProject({ emails: options, projectId });
  };

  const handleDeleteUserFromProject = (email: string) => {
    removeUserFromProject({ projectId, email });
  };

  const handleUsersRoleChange = (email: string, r: Role) => {
    changeRole({ projectId, email, role: r });
  };

  if (!isLoggedIn) {
    return <Redirect to="/unauthorized" />;
  }

  const deleteDocument = (documentId: number) => {
    deleteDocumentThunk({ projectId, documentId });
  };

  const projectInfo = (_project: Project | null) => {
    if (!_project) {
      return null;
    }
    return (
      <>
        <Typography variant="h3" component="h3">
          {_project.name}
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography variant="h5" component="h5">
          Added <Moment locale="pl" format="dddd, MMMM Do YYYY, h:mm" date={_project.createdAt} />
        </Typography>
        <Typography variant="h5" component="h5">
          Last Update <Moment locale="pl" fromNow date={_project.createdAt} />
        </Typography>
      </>
    );
  };

  const documentList = (
    <>
      <Typography variant="h4" component="h4">
        Documents
      </Typography>
      <br />
      <DocumentList
        documents={documents}
        documentsAnnotators={documentsAnnotators}
        accessToken={token}
        deleteDocument={deleteDocument}
        resolvedDocuments={resolvedDocuments}
        documentsWithConflicts={documentWithConflicts}
        role={role}
      />
      <div style={{ marginTop: '1em' }}>
        <Upload {...addDocumentProps}>
          <ButtonGroup style={{ minWidth: 200 }}>
            <Button variant="contained" color="primary">
              Add Documents
            </Button>
          </ButtonGroup>
        </Upload>
      </div>
    </>
  );

  const userList = (
    <>
      <Typography variant="h4" component="h4">
        Users
      </Typography>
      <br />
      <ProjectUserList
        currentUser={currentUser}
        addUsersToProject={handleAddUsersToProject}
        emails={emails}
        fetchEmails={() => fetchEmails()}
        users={users}
        changeUsersRole={handleUsersRoleChange}
        removeUserFromProject={handleDeleteUserFromProject}
      />
    </>
  );

  const dictionaryList = (
    <>
      <Typography variant="h4" component="h4">
        Dictionaries
      </Typography>
      <br />
      <DictionariesView projectId={projectId} />
    </>
  );

  const tagList = (
    <>
      <Typography variant="h4" component="h4">
        Tags
      </Typography>
      <br />
      <Container maxWidth="lg">
        <TagList tags={tags} addTag={addTag} setChosenTag={setChosenTag} editTagName={editTag} />
      </Container>
    </>
  );

  const components = {
    documents: documentList,
    users: userList,
    dictionaries: dictionaryList,
    tags: tagList,
  };

  const icons = {
    documents: <Description />,
    users: <SupervisorAccount />,
    dictionaries: <ListAlt />,
    tags: <LabelOutlined />,
  };

  const labels = {
    documents: 'Documents',
    users: 'Users',
    dictionaries: 'Dictionaries',
    tags: 'Tags',
  };

  return (
    <div className={styles.root}>
      {dialogVisible ? <DialogConfirm deleteTag={deleteTag} projectId={projectId} tag={chosenTag!!} /> : null}
      <Snackbar
        open={errorMessage !== ''}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
        autoHideDuration={2000}
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={() => setErrorMessage('')}>
            <Close />
          </IconButton>,
        ]}
      />
      <Navbar />
      {role === 'ADMIN' ? (
        <>
          <Drawer variant="permanent" className={styles.drawer} classes={{ paper: styles.drawerPaper }}>
            <div className={styles.toolbar} />
            <List>
              {Object.keys(components).map(page => (
                <>
                  <Link to={`/projects/${projectId}/${page}`} className={styles.link} key={page}>
                    <ListItem button selected={view === page}>
                      <ListItemIcon>
                        {
                          // @ts-ignore
                          icons[page]
                        }
                      </ListItemIcon>
                      <ListItemText>
                        {
                          // @ts-ignore
                          labels[page]
                        }
                      </ListItemText>
                    </ListItem>
                  </Link>
                  <Divider />
                </>
              ))}
            </List>
          </Drawer>
          <div className={styles.content}>
            {
              // @ts-ignore
              components[view] || projectInfo(project)
            }
          </div>
        </>
      ) : (
        <Container style={{ marginTop: '1.5em' }} maxWidth="lg">
          <>
            <Typography variant="h4" component="h4">
              Documents
            </Typography>
            <br />
            <DocumentList
              documents={documents}
              documentsAnnotators={documentsAnnotators}
              accessToken={token}
              documentsWithConflicts={documentWithConflicts}
              resolvedDocuments={resolvedDocuments}
              deleteDocument={deleteDocument}
              role={role}
            />
          </>
        </Container>
      )}
    </div>
  );
};

export default ProjectView;

import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add, Remove, ClearOutlined, WarningTwoTone, EditTwoTone, LockTwoTone } from '@material-ui/icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// @ts-ignore
import Popover from 'react-text-selection-popover';
// @ts-ignore
import placeRightBelow from 'react-text-selection-popover/lib/placeRightBelow';
import { Link, match, useHistory, Redirect } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { config } from 'react-spring';
import * as rangy from 'rangy';
import 'rangy/lib/rangy-textrange';
import Carousel from 'react-spring-3d-carousel';
import { Skeleton } from 'antd';
// @ts-ignore
import KeyboardEventHandler from 'react-keyboard-event-handler';
// @ts-ignore
import Toolbox from '../components/Toolbox/Toolbox';
import AnnotatorTagListComponent from '../components/TagList/AnnotatorTagList';
import Tag from '../types/Tag';
import Document from '../types/Document';
import Popup from '../components/Popup/Popup';
import AnnotatedText from '../components/AnnotatatedText/AnnotatedText';
import { useStoreState, useStoreActions } from '../store/hooks';
import 'antd/dist/antd.css';
import './Workspace.css';

const useStyles = makeStyles({
  skeleton: {
    pointerEvents: 'none',
  },
  emptyPaper: {
    width: '18em',
    padding: 24,
    borderRadius: 1,
    borderStyle: 'solid',
    borderColor: '#B7B7B7',
    backgroundColor: '#F9F9F9',
    overflowWrap: 'break-word',
    position: 'relative',
  },
  paper: {
    width: '100%',
    padding: 24,
    borderRadius: 0,
    minHeight: 350,
    fontFamily: 'Arial, Helvetica',
    overflowWrap: 'break-word',
    position: 'relative',
    height: '100%',
    overflowY: 'scroll',
  },
  nonCarouselPaper: {
    width: '82%',
    padding: 24,
    borderRadius: 0,
    minHeight: 350,
    maxHeight: 700,
    margin: '-12em auto 0 auto',
    fontFamily: 'Arial, Helvetica',
    overflowWrap: 'break-word',
    height: '100%',
    overflowY: 'scroll',
  },
  toolboxButton: {
    width: 40,
    minWidth: 40,
    fontSize: 10,
  },
  container: {
    lineHeight: '1.5',
    marginTop: '8em',
    paddingBottom: '50px',
    marginBottom: '9em',
  },
  popover: {
    zIndex: 1000,
    maxHeight: 300,
    overflowY: 'scroll',
  },
  tagListTooltip: {
    zIndex: 1000,
    height: 50,
    width: 100,
    backgroundColor: 'rgba(120, 30, 60, 0.3)',
  },
  documentList: {
    width: 350,
  },
  primary: {
    fontWeight: 'bold',
  },
});

interface WorkspaceParameters {
  projectId: string;
  documentId: string;
}

interface WorkspaceProps {
  match?: match<WorkspaceParameters>;
}

const getDocumentIndex = (documents: Document[], documentId: number): number =>
  documents ? documents.findIndex(doc => doc.id === documentId) : 0;

// eslint-disable-next-line no-shadow
const Workspace: FC<WorkspaceProps> = ({ match }: WorkspaceProps) => {
  const styles = useStyles();

  const [ref] = useInView();
  const inputRef = useRef();

  const history = useHistory();

  const projectId = Number(match!!.params.projectId);
  const documentId = Number(match!!.params.documentId);

  const isLoggedIn = useStoreState(state => state.userModel.isLoggedIn);

  const fontSize = useStoreState(state => state.workspaceModel.fontSize);
  const annotations = useStoreState(state => state.annotationModel.annotations);
  const chunks = useStoreState(state => state.workspaceModel.chunks);
  const popupVisible = useStoreState(state => state.workspaceModel.popupVisible);
  const selection = useStoreState(state => state.workspaceModel.selection);
  const drawerVisible = useStoreState(state => state.workspaceModel.drawerVisible);

  const project = useStoreState(state => state.projectModel.projects);
  const document = useStoreState(state => state.documentModel.currentDocument);
  const documents = useStoreState(state => state.documentModel.documents);

  const togglePopup = useStoreActions(actions => actions.workspaceModel.togglePopupVisible);
  const increaseFontSize = useStoreActions(actions => actions.workspaceModel.increaseFontSize);
  const decreaseFontSize = useStoreActions(actions => actions.workspaceModel.decreaseFontSize);
  const toggleDrawerVisible = useStoreActions(actions => actions.workspaceModel.toggleDrawerVisible);

  const fetchTags = useStoreActions(actions => actions.tagModel.fetchTags);
  const tags = useStoreState(state => state.tagModel.tags);

  const setSelection = useStoreActions(actions => actions.workspaceModel.setSelection);
  const toggleAnnotation = useStoreActions(actions => actions.annotationModel.toggleAnnotation);
  const fetchAnnotations = useStoreActions(actions => actions.annotationModel.fetchAnnotations);
  const clearAnnotationsAction = useStoreActions(actions => actions.annotationModel.clearAnnotations);

  const fetchDocuments = useStoreActions(actions => actions.documentModel.fetchDocuments);
  const fetchDocument = useStoreActions(actions => actions.documentModel.fetchDocument);

  const projectRoles = useStoreState(state => state.userModel.user.projectRoles);
  const { role } = projectRoles.find(pr => pr.projectId === projectId)!!;

  const documentWithConflicts = useStoreState(state => state.reviewModel.documentsWithConflicts);
  const fetchDocumentsWithConflicts = useStoreActions(actions => actions.reviewModel.fetchDocumentsWithConflicts);

  const resolvedDocuments = useStoreState(state => state.reviewModel.resolvedDocuments);
  const fetchResolvedDocuments = useStoreActions(actions => actions.reviewModel.fetchResolvedDocuments);

  useEffect(() => {
    fetchTags(projectId);
    fetchDocuments(projectId);
    fetchAnnotations({ projectId, documentId });
    fetchDocument({ projectId, documentId });
    fetchDocumentsWithConflicts(projectId);
    fetchResolvedDocuments(projectId);
  }, [documentId]);

  useEffect(() => {
    const [start, end] = selection;
    if (start !== end) {
      if (popupVisible) {
        togglePopup();
      } else {
        // small delay to avoid flickering
        setTimeout(togglePopup, 10);
      }
    }
  }, [selection]);

  const documentHasFinalAnnnotation = annotations.some(ann => ann.isFinal);

  const fontSizeChangeButtonGroup = (
    <ButtonGroup id="fontSizeChangeButtonGroup" variant="outlined">
      <Tooltip title="Decrease font size" placement="top" id="fontSizeDecToolTip" enterDelay={500}>
        <Button
          data-testid="decreaseFontSizeButton"
          className={styles.toolboxButton}
          onClick={() => decreaseFontSize()}
        >
          <Remove />
        </Button>
      </Tooltip>
      <Tooltip title="Increase font size" placement="top" id="fontSizeIncToolTip" enterDelay={500}>
        <Button
          data-testid="increaseFontSizeButton"
          className={styles.toolboxButton}
          onClick={() => increaseFontSize()}
        >
          <Add />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );

  const handleChoice = (tag: Tag) => {
    const [start, end] = selection;
    toggleAnnotation({ projectId, documentId, annotation: { start, end, tagId: tag.id } });
    togglePopup();
  };

  const handleKeyPress = (key: string) => {
    const offset = key === 'right' ? 1 : -1;
    const currentDocumentIndex = documents ? documents.findIndex(doc => doc.id === documentId) : -1;
    let idx = currentDocumentIndex + offset;
    if (idx < 0) {
      idx = documents.length - 1;
    } else if (idx === documents.length) {
      idx = 0;
    }
    const nextDocumentId = documents[idx].id;
    history.push(`/projects/${projectId}/workspace/${nextDocumentId}`);
  };

  const handleTextSelection = () => {
    if (documentHasFinalAnnnotation) {
      return;
    }
    const domSelection = rangy.getSelection();
    if (domSelection && !domSelection.isCollapsed) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const editor = window.document.getElementById('editor')!!;
      // @ts-ignore
      domSelection.expand('word');
      const { start, end } = domSelection.getRangeAt(0).toCharacterRange(editor);
      setSelection([start, end]);
    }
  };

  const popup = (
    <ClickAwayListener onClickAway={() => togglePopup()} mouseEvent="onMouseDown">
      <div ref={ref}>
        <Popup annotations={annotations} selection={selection} handleChoice={handleChoice} tags={tags} />
      </div>
    </ClickAwayListener>
  );

  const conflicts =
    role === 'ADMIN' ? (
      <Link
        to={`/projects/${projectId}/workspace/${documentId}/review`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Tooltip title="Conflict" placement="top">
          <WarningTwoTone style={{ color: 'red', margin: '0 auto' }} />
        </Tooltip>
      </Link>
    ) : <></>;

  const documentConflicts = (doc: Document) => (
    <Link to={`/projects/${projectId}/workspace/${doc.id}/review`} style={{ display: 'flex', flexDirection: 'column' }}>
      <Tooltip title="Conflict" placement="top">
        <WarningTwoTone style={{ color: 'red', margin: '0 auto' }} />
      </Tooltip>
    </Link>
  );

  const locker = (doc: Document | null) =>
    role === 'USER' ? (
      <Tooltip title="This document has already been approved" placement="top">
        <LockTwoTone style={{ margin: '0 auto' }} />
      </Tooltip>
    ) : (
      <Link
        to={`/projects/${projectId}/workspace/${doc ? doc.id : ''}/review`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Tooltip title="This document has already been approved. Click here to review changes" placement="top">
          <LockTwoTone style={{ margin: '0 auto' }} />
        </Tooltip>
      </Link>
    );

  const mainDocument = (doc: Document) => ({
    key: doc.id,
    content: (
      <Paper
        data-testid="editor"
        className={styles.paper}
        ref={inputRef}
        onMouseUp={handleTextSelection}
        style={{ fontSize }}
        id="editor"
      >
        <AnnotatedText chunks={chunks} tags={tags} text={document ? document.text : ''} level={0} />
      </Paper>
    ),
  });

  const toConfirm = (doc: Document | null) => (
    role === 'ADMIN' ? (
      <Link
        to={`/projects/${projectId}/workspace/${doc ? doc.id : '0'}/review`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Tooltip title="Review and approve the document" placement="top">
          <EditTwoTone style={{ color: 'blue', margin: '0 auto' }} />
        </Tooltip>
      </Link>
    ) : <></>);

  const skeletonDocument = (doc: Document) => ({
    key: doc.id,
    content: (
      <Link to={`/projects/${projectId}/workspace/${doc.id}`}>
        <Paper data-testid="editor" className={styles.emptyPaper} id={doc.id.toString()}>
          <Skeleton paragraph={{ rows: 5 }} className={styles.skeleton} />
        </Paper>
      </Link>
    ),
  });

  const slides = documents
    ? documents.map(doc => (doc.id === documentId ? mainDocument(doc) : skeletonDocument(doc)))
    : null;

  const documentTitle = <Typography>{document ? document.name : ''}</Typography>;

  const documentIndicator = (
    <Typography>
      {getDocumentIndex(documents, documentId) + 1}
      {'/'}
      {documents ? documents.length : 0}
    </Typography>
  );

  const leftToolboxItems = () => {
    if (documentHasFinalAnnnotation) {
      return [documentTitle, locker(document), documentIndicator];
    }
    if (documentWithConflicts.includes(documentId)) {
      return [documentTitle, conflicts, documentIndicator];
    }
    return [documentTitle, toConfirm(document), documentIndicator];
  };

  if (!isLoggedIn) {
    return <Redirect to="/unauthorized" />;
  }

  return (
    <>
      <KeyboardEventHandler handleKeys={['left', 'right']} onKeyEvent={(key: string) => handleKeyPress(key)} />
      <Drawer open={drawerVisible} onClose={() => toggleDrawerVisible()}>
        {documents ? (
          <List className={styles.documentList}>
            {documents.map((doc: Document, idx: number) => (
              <Link to={`/projects/${projectId}/workspace/${doc.id}`} style={{ color: 'black' }}>
                <ListItem button selected={doc.id === documentId}>
                  <ListItemText
                    style={{ flex: 'none', marginRight: '1vh' }}
                    classes={{ primary: styles.primary }}
                    primary={`${idx}.`}
                  />
                  <ListItemText primary={doc.name} style={{ flex: 'none' }} />
                  {role === 'ADMIN' ? (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        {resolvedDocuments.includes(doc.id)
                          ? locker(doc)
                          : documentWithConflicts.includes(doc.id)
                          ? documentConflicts(doc)
                          : toConfirm(document)}
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : null}
                </ListItem>
              </Link>
            ))}
          </List>
        ) : null}
      </Drawer>
      <Container maxWidth="md" className={styles.container} id="textContainer">
        <AnnotatorTagListComponent tags={tags} />
        <Toolbox alignment="right" items={[fontSizeChangeButtonGroup]} />
        <Toolbox alignment="left" alignSelfLastItem items={leftToolboxItems()} />
        <Popover
          isOpen={popupVisible}
          selectionRef={inputRef}
          placementStrategy={placeRightBelow}
          className={styles.popover}
        >
          {popup}
        </Popover>
      </Container>
      {documents && documents.length >= 3 ? (
        <>
          <Carousel
            // @ts-ignore
            slides={slides}
            goToSlide={getDocumentIndex(documents, documentId)}
            offsetRadius={1}
            showNavigation={false}
            animationConfig={config.default}
          />
          <div style={{ margin: '18em 0 18em 0' }} />
        </>
      ) : (
        <Container maxWidth="lg" className={styles.container}>
          <Paper
            data-testid="editor"
            className={styles.nonCarouselPaper}
            ref={inputRef}
            onMouseUp={handleTextSelection}
            style={{ fontSize }}
            id="editor"
          >
            <AnnotatedText chunks={chunks} tags={tags} text={document ? document.text : ''} level={0} />
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Workspace;

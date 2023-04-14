import React, { FC, useEffect, useRef, useState } from 'react';
import {
  makeStyles,
  Paper,
  Container,
  Tabs,
  Tab,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Typography,
  Button,
  Divider,
  ListItemSecondaryAction,
  Checkbox,
  Tooltip,
} from '@material-ui/core';
import { match, Redirect, useHistory } from 'react-router-dom';
// @ts-ignore
import xolor from 'xolor';
// @ts-ignore
import Popover from 'react-text-selection-popover';
import { isEqual } from 'lodash';
import { Tag as AntdTag } from 'antd';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
// @ts-ignore
import placeRightBelow from 'react-text-selection-popover/lib/placeRightBelow';
import { useInView } from 'react-intersection-observer';
import * as rangy from 'rangy';
import Tag from '../types/Tag';
import { useStoreActions, useStoreState } from '../store/hooks';
import AnnotatedText from '../components/AnnotatatedText/AnnotatedText';
import Popup from '../components/Popup/Popup';
import { findAll } from '../Workspace/utils/splitTextIntoChunks';

const useStyles = makeStyles(theme => ({
  root: {
    height: '85vh',
    padding: 0,
    margin: '7em auto 1em auto',
    display: 'grid',
    gridTemplateColumns: '58% 42%',
    gridTemplateRows: '1fr 1fr',
    gridGap: '1em',
  },
  final: {
    gridColumnStart: 1,
    gridColumnEnd: 1,
    gridRowStart: 1,
    gridRowEnd: 1,
    width: '100%',
    padding: 12,
    borderRadius: 0,
    minHeight: 330,
    fontFamily: 'Arial, Helvetica',
    overflowWrap: 'break-word',
    position: 'relative',
    height: '100%',
    overflowY: 'scroll',
  },
  users: {
    gridColumnStart: 1,
    gridColumnEnd: 1,
    gridRowStart: 2,
    gridRowEnd: 2,
  },
  conflicts: {
    gridColumnStart: 2,
    gridColumnEnd: 2,
    gridRowStart: 1,
    gridRowEnd: 3,
  },
  tabs: {
    flexGrow: 1,
    width: '100%',
  },
  usersPaper: {
    width: '100%',
    padding: 12,
    borderRadius: 0,
    height: '85%',
    fontFamily: 'Arial, Helvetica',
    overflowWrap: 'break-word',
    position: 'relative',
    overflowY: 'scroll',
  },
  nextButton: {
    margin: '1.15em',
    float: 'right',
    width: 190,
  },
  prevButton: {
    margin: '1.15em',
    float: 'left',
    width: 190,
  },
  conflictsTitle: {
    padding: '0.65em',
  },
  conflictHeader: {
    marginTop: '1em',
    display: 'flex',
    paddingLeft: '1.15em',
  },
  tag: {
    marginLeft: '1em',
  },
  popover: {
    zIndex: 1000,
    maxHeight: 300,
    overflowY: 'scroll',
  },
}));

const theSameColorDifferentAlpha = (color: string, alpha: number) => {
  const { r, g, b } = xolor(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ReviewViewParameters {
  projectId: string;
  documentId: string;
}

interface ReviewViewProps {
  match?: match<ReviewViewParameters>;
}

// eslint-disable-next-line no-shadow
const ReviewView: FC<ReviewViewProps> = ({ match }: ReviewViewProps) => {
  const styles = useStyles();

  const [ref] = useInView();
  const inputRef = useRef();
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentConflictIdx, setCurrentConflictIdx] = useState<number>(0);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [selection, setSelection] = useState<[number, number]>([0, 0]);

  const tags = useStoreState(state => state.tagModel.tags);
  const fetchTags = useStoreActions(actions => actions.tagModel.fetchTags);

  const finalChunks = useStoreState(state => state.reviewModel.finalChunks);

  const document = useStoreState(state => state.documentModel.currentDocument);
  const fetchDocuments = useStoreActions(actions => actions.documentModel.fetchDocument);
  const text = document ? document.text : '';

  const projectId = Number(match!!.params.projectId);
  const documentId = Number(match!!.params.documentId);

  const isLoggedIn = useStoreState(state => state.userModel.isLoggedIn);
  const projectRoles = useStoreState(state => state.userModel.user.projectRoles);
  const { role } = projectRoles.find(pr => pr.projectId === projectId)!!;

  const annotations = useStoreState(state => state.reviewModel.annotations);
  const users = Object.keys(annotations);
  const fetchAnnotations = useStoreActions(state => state.reviewModel.fetchAnnotations);

  const toggleFinalAnnotation = useStoreActions(actions => actions.reviewModel.toggleAnnotation);
  const conflicts = useStoreState(state => state.reviewModel.conflicts);
  const currentConflict = conflicts[currentConflictIdx];

  const chosenAnnotations = useStoreState(state => state.reviewModel.chosenAnnotations);

  const finalAnnotations = useStoreState(state => state.reviewModel.finalAnnotations);
  const saveFinalAnnotations = useStoreActions(actions => actions.reviewModel.saveFinalAnnotations);

  const imageUrls = useStoreState(state => state.reviewModel.imageUrls);

  const fetchFinalAnnotations = useStoreActions(actions => actions.reviewModel.fetchFinalAnnotations);

  const currentUser = users[selectedTab];
  const currentConflictAndUserChunks = findAll({
    annotations: currentConflict
      ? currentConflict.conflicts.filter(c => c.user === currentUser).flatMap(ca => ca.annotations)
      : [],
    textToHighlight: text,
  });

  useEffect(() => {
    fetchAnnotations({ projectId, documentId });
    fetchDocuments({ projectId, documentId });
    fetchFinalAnnotations({ projectId, documentId });
    fetchTags(projectId);
  }, []);

  useEffect(() => {
    const [start, end] = selection;
    if (start !== end) {
      if (popupVisible) {
        setPopupVisible(!popupVisible);
      } else {
        // small delay to avoid flickering
        setTimeout(() => setPopupVisible(!popupVisible), 10);
      }
    }
  }, [selection]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleTextSelection = () => {
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

  const handleChoice = (tag: Tag) => {
    const [start, end] = selection;
    // it gets overriden when sent to be
    toggleFinalAnnotation({ start, end, tagId: tag.id, isFinal: false });
    setPopupVisible(!popupVisible);
  };

  if (!isLoggedIn) {
    return <Redirect to="/unauthorized" />;
  }

  if (role !== 'ADMIN') {
    return <Redirect to={`projects/${projectId}/workspace/${documentId}`} />;
  }

  const popup = (
    <ClickAwayListener onClickAway={() => setPopupVisible(!popupVisible)} mouseEvent="onMouseDown">
      <div ref={ref}>
        <Popup annotations={chosenAnnotations} selection={selection} handleChoice={handleChoice} tags={tags} />
      </div>
    </ClickAwayListener>
  );

  return (
    <>
      <Popover
        isOpen={popupVisible}
        selectionRef={inputRef}
        placementStrategy={placeRightBelow}
        className={styles.popover}
      >
        {popup}
      </Popover>
      <Container maxWidth="lg" className={styles.root}>
        <Paper className={styles.final} ref={inputRef} onMouseUp={handleTextSelection} id="editor">
          <AnnotatedText tags={tags} chunks={finalChunks} text={text} level={0} />
        </Paper>
        <div className={styles.users}>
          <Paper square className={styles.tabs}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon tabs example"
            >
              {users.map(user => (
                <Tab label={user} aria-label={user}>
                  {users}
                </Tab>
              ))}
            </Tabs>
          </Paper>
          <Paper className={styles.usersPaper}>
            <AnnotatedText tags={tags} chunks={currentConflictAndUserChunks} text={text} level={0} />
          </Paper>
        </div>
        <Paper className={styles.conflicts}>
          <Typography className={styles.conflictsTitle} variant="h5" component="h5">
            {conflicts.length ? `Conflict ${currentConflictIdx + 1} / ${conflicts.length || 1}` : 'No conflicts'}
          </Typography>
          {currentConflict ? (
            <>
              {currentConflict.conflicts
                .sort((a, b) => a.user.localeCompare(b.user))
                .map((conflict, idx) => (
                  <>
                    <div onMouseEnter={() => setSelectedTab(users.indexOf(conflict.user))}>
                      <div className={styles.conflictHeader}>
                        <Avatar src={imageUrls[conflict.user]} alt={conflict.user} />
                        <Typography variant="subtitle1" component="p" className={styles.conflictsTitle}>
                          {conflict.user}
                        </Typography>
                      </div>
                      <List>
                        {conflict.annotations.map(annotation => {
                          const tag = tags.find(t => t.id === annotation.tagId);
                          return (
                            <ListItem
                              button
                              style={{
                                width: '100%',
                                backgroundColor: finalAnnotations.find(a => isEqual(a, annotation))
                                  ? theSameColorDifferentAlpha(tag ? tag.color : 'gray', 0.2)
                                  : 'white',
                              }}
                              onClick={() => toggleFinalAnnotation(annotation)}
                            >
                              <ListItemText style={{ width: '100%' }}>
                                {text.substring(annotation.start, annotation.end)}
                                {tag ? (
                                  <AntdTag className={styles.tag} color={theSameColorDifferentAlpha(tag.color, 0.8)}>
                                    {tag.name}
                                  </AntdTag>
                                ) : null}
                              </ListItemText>
                              <ListItemSecondaryAction>
                                <Checkbox
                                  edge="end"
                                  onChange={() => toggleFinalAnnotation(annotation)}
                                  checked={finalAnnotations.some(a => isEqual(a, annotation))}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          );
                        })}
                      </List>
                    </div>
                    {idx !== currentConflict.conflicts.length - 1 && <Divider />}
                  </>
                ))}
              <Button
                size="medium"
                variant="contained"
                className={styles.prevButton}
                disabled={currentConflictIdx === 0}
                onClick={() => setCurrentConflictIdx(currentConflictIdx - 1)}
              >
                Previous conflict
              </Button>
              <Button
                className={styles.nextButton}
                variant="contained"
                size="medium"
                disabled={currentConflictIdx === conflicts.length - 1}
                onClick={() => setCurrentConflictIdx(currentConflictIdx + 1)}
              >
                Next conflict
              </Button>
              {currentConflictIdx === conflicts.length - 1 ? (
                <>
                  <Tooltip title="Changes won't be saved unless you confirm them" placement="left">
                    <Button
                      className={styles.nextButton}
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        saveFinalAnnotations({ projectId, documentId });
                        history.push(`/projects/${projectId}/workspace/${documentId}`);
                      }}
                    >
                      Save and exit
                    </Button>
                  </Tooltip>
                </>
              ) : null}
            </>
          ) : null}
        </Paper>
      </Container>
    </>
  );
};

export default ReviewView;

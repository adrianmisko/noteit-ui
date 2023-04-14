import React, { FC, useState, useRef, useEffect } from 'react';
import { Chip, createStyles, makeStyles, Theme, Avatar, InputBase, Fab } from '@material-ui/core';
import { Add, CheckCircle, Cancel } from '@material-ui/icons';
import randomColor from 'randomcolor';
// @ts-ignore
import KeyboardEventHandler from 'react-keyboard-event-handler';

import Tag from '../../types/Tag';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useStoreActions } from '../../store/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '1em 6em',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      fontSize: 16,
      margin: theme.spacing(1),
    },
  }),
);

interface TagListProps {
  tags: Tag[];
  addTag: (name: string, color: string) => boolean;
  setChosenTag: (tag: Tag) => void;
  editTagName: (id: number, name: string) => boolean;
}

const TagList: FC<TagListProps> = ({ tags, addTag, setChosenTag, editTagName }: TagListProps) => {
  const ADD_TAG_FAB_SIZE = 25;

  const newColor = () => {
    return randomColor({ format: 'rgba', alpha: 0.4 });
  };

  const styles = useStyles();

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [tagName, setTagName] = useState<string>('');
  const [color, setColor] = useState<string>(newColor());
  const [tagBeingEditedId, setTagBeingEditedId] = useState<number>(-1);
  const [tagBeingEditedName, setTagBeingEditedName] = useState<string>('');
  const toggleDialogVisible = useStoreActions(actions => actions.workspaceModel.toggleDialogVisible);
  const ref = useRef();

  useEffect(() => {
    if (isAddingNew || tagBeingEditedId !== -1) {
      // @ts-ignore
      ref.current.children[0].focus();
    }
  }, [isAddingNew, tagBeingEditedId]);

  const confirmAdd = () => {
    let succedeed = false;
    if (tagName) {
      succedeed = addTag(tagName, color);
    }
    if (succedeed) {
      setTagName('');
      setIsAddingNew(false);
      setColor(newColor());
    }
  };

  const cancel = () => {
    setTagName('');
    setIsAddingNew(false);
    setTagBeingEditedName('');
    setTagBeingEditedId(-1);
  };

  const cancelOrConfirmAdd = (key: string, event: KeyboardEvent) => {
    event.preventDefault();
    if (key === 'esc') {
      cancel();
    } else if (key === 'enter') {
      confirmAdd();
    }
  };

  const confirmEdit = () => {
    const succedeed = editTagName(tagBeingEditedId, tagBeingEditedName);
    if (succedeed) {
      setTagBeingEditedName('');
      setTagBeingEditedId(-1);
    }
  };

  const cancelOrConfirmEdit = (key: string, event: KeyboardEvent) => {
    event.preventDefault();
    if (key === 'esc') {
      cancel();
    } else if (key === 'enter') {
      confirmEdit();
    }
  };

  const deleteOrEditTag = (tag: Tag) => {
    if (tagBeingEditedId === tag.id) {
      confirmEdit();
    } else {
      setChosenTag(tag);
      toggleDialogVisible();
    }
  };

  const addNewTag = (event: KeyboardEvent | null) => {
    if (event) {
      event.preventDefault();
    }
    setIsAddingNew(!isAddingNew);
  };

  return (
    <>
      <KeyboardEventHandler
        handleKeys={['alt+n']}
        onKeyEvent={(key: string, event: KeyboardEvent) => addNewTag(event)}
      />
      <div className={styles.container}>
        {tags.map(tag => (
          <Chip
            key={tag.id}
            className={styles.chip}
            avatar={<Avatar style={{ backgroundColor: tag.color }}>{tag.name.substring(0, 1).toUpperCase()}</Avatar>}
            label={tagBeingEditedId === tag.id ?
              <KeyboardEventHandler
                handleKeys={['esc', 'enter', 'alt+n']}
                handleFocusableElements={true}
                onKeyEvent={(key: string, event: KeyboardEvent) => cancelOrConfirmEdit(key, event)}
              >
              <ClickAwayListener
                key={tag.id}
                onClickAway={() => cancel()}
              >
                <InputBase
                  id="editTagInput"
                  inputProps={{ 'aria-label': 'naked' }}
                  ref={ref}
                  style={{ maxWidth: 90, fontSize: 16 }}
                  value={tagBeingEditedName}
                  onChange={e => setTagBeingEditedName(e.target.value)} />
                </ClickAwayListener>
              </KeyboardEventHandler> : tag.name}
            style={{ backgroundColor: tag.color }}
            deleteIcon={tagBeingEditedId === tag.id ? <CheckCircle /> : <Cancel />}
            onClick={() => { setTagBeingEditedName(tag.name); setTagBeingEditedId(tag.id) }}
            onDelete={() => deleteOrEditTag(tag)}
          />
        ))}
        {isAddingNew ?
          <ClickAwayListener
            onClickAway={() => cancel()}
          >
          <Chip
            style={{ backgroundColor: color }}
            className={styles.chip}
            onDelete={confirmAdd}
            deleteIcon={tagName ? <CheckCircle /> : <Cancel />}
            label={
              <KeyboardEventHandler
              handleKeys={['esc', 'enter', 'alt+n']}
              handleFocusableElements={true}
              onKeyEvent={(key: string, event: KeyboardEvent) => cancelOrConfirmAdd(key, event)}
            >
              <InputBase
                id="newTagInput"
                placeholder="New tag"
                inputProps={{ 'aria-label': 'naked' }}
                ref={ref}
                style={{ maxWidth: 90, fontSize: 16 }}
                value={tagName}
                onChange={e => setTagName(e.target.value)} />
            </KeyboardEventHandler>
            }
          />
        </ClickAwayListener>
        :
        <Fab
          style={{
             backgroundColor: color,
             width: ADD_TAG_FAB_SIZE,
             height: ADD_TAG_FAB_SIZE,
             minHeight: ADD_TAG_FAB_SIZE,
             minWidth: ADD_TAG_FAB_SIZE,
             marginTop: 11,
             marginLeft: 8
            }}
          onClick={() => addNewTag(null)}
        >
          <Add />
        </Fab>
        }
      </div>
    </>
  );
};

export default TagList;

import React, { FC } from 'react';
import { List, ListItem, makeStyles, Theme, useTheme } from '@material-ui/core';
import Tag from '../../types/Tag';
import Annotation from '../../types/Annotation';

interface PopupProps {
  handleChoice: (tag: Tag) => void;
  annotations: Annotation[];
  selection: [number, number];
  tags: Tag[];
}

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.background.default,
    boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, .2)',
    maxWidth: 300,
    minWidth: 150,
    width: '100%',
  },
}));

const Popup: FC<PopupProps> = ({ tags, handleChoice, annotations, selection }: PopupProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const isAlreadySelected = (tag: Tag): boolean =>
    annotations.some((a: Annotation) => a.start === selection[0] && a.end === selection[1] && a.tagId === tag.id);

  return (
    <List className={styles.list} data-testid="tagList">
      {tags.map((tag: Tag) => (
        <ListItem
          key={tag.name}
          button
          style={{ backgroundColor: isAlreadySelected(tag) ? tag.color : theme.palette.background.default }}
          selected={isAlreadySelected(tag)}
          onClick={() => handleChoice(tag)}
        >
          {tag.name}
        </ListItem>
      ))}
    </List>
  );
};

export default Popup;

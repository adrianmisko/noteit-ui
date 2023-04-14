import React, { FC } from 'react';
import { Chip, createStyles, makeStyles, Theme, Avatar } from '@material-ui/core';
import Tag from '../../types/Tag';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '1em 6em',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      margin: theme.spacing(1),
    },
  }),
);

interface TagListProps {
  tags: Tag[];
}

const AnnotatorTagList: FC<TagListProps> = ({ tags }: TagListProps) => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.container}>
        {tags.map(tag => (
          <Chip
            key={tag.id}
            className={styles.chip}
            avatar={<Avatar style={{ backgroundColor: tag.color }}>{tag.name.substring(0, 1).toUpperCase()}</Avatar>}
            label={tag.name}
            style={{ backgroundColor: tag.color }}
          />
        ))}
      </div>
    </>
  );
};

export default AnnotatorTagList;

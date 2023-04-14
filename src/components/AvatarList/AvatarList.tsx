import React, { FC } from 'react';
import { Avatar, makeStyles } from '@material-ui/core';

export interface AvatarListProps {
  imageUrls: string[];
}

const AvatarList: FC<AvatarListProps> = ({ imageUrls }: AvatarListProps) => {
  const AVATAR_SIZE = 25;

  const useStyles = makeStyles(() => ({
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      border: '1px solid white',
    },
  }));

  const styles = useStyles();

  return (
    <span style={{ display: 'flex', width: '20%', marginTop: 6 }}>
      {imageUrls.length
        ? imageUrls.map((url: string, idx: number) => {
          const transform = `translate(${(-AVATAR_SIZE / 2.2) * idx}px, 0px)`;
          return <Avatar className={styles.avatar} src={url} style={{ transform }} />;
        })
        : 'no annotations'}
    </span>
  );
};

export default AvatarList;

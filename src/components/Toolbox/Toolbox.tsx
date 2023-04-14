import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core';

interface ToolboxProps {
  items: JSX.Element[];
  alignment: 'left' | 'right';
  alignSelfLastItem?: boolean;
}

const Toolbox: FC<ToolboxProps> = ({ items, alignment, alignSelfLastItem }: ToolboxProps) => {
  const useStyles = makeStyles({
    toolbox: {
      marginRight: '6em',
      marginLeft: '5.5em',
      marginBottom: '1em',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: alignment === 'right' ? 'flex-end' : 'flex-start',
    },
    toolboxItem: {
      marginLeft: '0.75em',
    },
    toolboxItemOtherSide: {
      marginLeft: alignSelfLastItem && alignment === 'left' ? 'auto' : '0.75em',
      marginRight: alignSelfLastItem && alignment === 'right' ? 'auto' : '0.75em',
    },
  });

  const styles = useStyles();

  return (
    <div data-testid="toolbox" className={styles.toolbox}>
      {items &&
        items.map((item: JSX.Element, idx: number) => (
          <div
            className={idx === items.length - 1 ? styles.toolboxItemOtherSide : styles.toolboxItem}
            key={item.props.id}
          >
            {item}
          </div>
        ))}
    </div>
  );
};

export default Toolbox;

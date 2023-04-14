import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, makeStyles, Paper, TextField } from '@material-ui/core';
// @ts-ignore
import KeyboardEventHandler from 'react-keyboard-event-handler';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
  },
  textField: {
    marginRight: theme.spacing(1),
    width: '100%',
  },
}));

interface NewProjectFormProps {
  addProject: (name: string) => void;
}

// TODO validation!
const NewProjectForm: FC<NewProjectFormProps> = ({ addProject }: NewProjectFormProps) => {
  const styles = useStyles();

  const ref = useRef(null);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.children[0].focus();
    }
  });

  const handleSubmit = () => {
    addProject(inputValue);
  };

  return (
    <Paper className={styles.container}>
      <KeyboardEventHandler handleKeys={['enter']} onKeyEvent={handleSubmit} handleFocusableElements>
        <TextField
          ref={ref}
          id="new-project-name"
          className={styles.textField}
          label="Project name"
          margin="normal"
          value={inputValue}
          variant="outlined"
          inputProps={{'data-testid':'projectNameInput'}}
          onChange={e => setInputValue(e.target.value)}
        />
      <Button onClick={handleSubmit} data-testid="addConfirmButton">Add</Button>
      </KeyboardEventHandler>
    </Paper>
  );
};

export default NewProjectForm;

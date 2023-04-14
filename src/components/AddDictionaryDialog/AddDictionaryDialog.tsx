import React, { FC, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogTitle,
  DialogActions,
  ButtonGroup,
} from '@material-ui/core';
import { Upload, message } from 'antd';
import { useStoreActions, useStoreState } from '../../store/hooks';
import HOSTNAME from '../../config';
import './AddDictionaryDialog.css';

interface DialogProps {
  projectId: number;
}

const AddDictionaryDialog: FC<DialogProps> = ({ projectId }: DialogProps) => {
  const toggleDialogVisible = useStoreActions(actions => actions.projectModel.toggleDialogVisible);
  const addDictionaryToList = useStoreActions(actions => actions.dictionaryModel.addDictionaryToList);
  const token = useStoreState(state => state.userModel.token);
  const [tagName, setTagName] = useState<string>('');

  const handleChange = (event: any) => {
    setTagName(event.target!.value);
  };

  const addDictionaryProps = {
    name: 'dictionary',
    showUploadList: false,
    accept: '.csv',
    action: `${HOSTNAME}/api/projects/${projectId}/dictionaries/${tagName}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} dictionary loaded.`);
        setTagName('');
        addDictionaryToList(response);
        toggleDialogVisible();
      } else if (status === 'error') {
        message.error(`${info.file.name} loading dictionary error`);
        toggleDialogVisible();
      }
    },
  };

  return (
    <Dialog maxWidth="sm" fullWidth open aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Dictionary</DialogTitle>
      <DialogContent style={{ height: '100%' }}>
        <DialogContentText>Write a tag name, next pick a file. Supported formats: csv.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="tagName"
          label="Tag Name"
          fullWidth
          onChange={handleChange}
          value={tagName}
          style={{ marginBottom: '20px' }}
        />
        <Upload {...addDictionaryProps} disabled={!tagName.length}>
          <ButtonGroup fullWidth disabled={!tagName.length}>
            <Button variant="contained" color="primary">
              Add a file
            </Button>
          </ButtonGroup>
        </Upload>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleDialogVisible()} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDictionaryDialog;

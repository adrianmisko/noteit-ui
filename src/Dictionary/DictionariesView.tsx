import React, { FC, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useStoreState, useStoreActions } from '../store/hooks';
import AddDictionaryDialog from '../components/AddDictionaryDialog/AddDictionaryDialog';

interface DictionariesViewProps {
  projectId: number;
}

const DictionariesView: FC<DictionariesViewProps> = ({ projectId }: DictionariesViewProps) => {
  const dialogVisible = useStoreState(state => state.projectModel.dialogVisible);
  const toggleDialogVisible = useStoreActions(actions => actions.projectModel.toggleDialogVisible);
  const dictionaries = useStoreState(state => state.dictionaryModel.dictionaries);
  const fetchDictionaries = useStoreActions(actions => actions.dictionaryModel.fetchDictionaries);
  const deleteDictionary = useStoreActions(actions => actions.dictionaryModel.deleteDictionary);

  useEffect(() => {
    fetchDictionaries(projectId);
  }, [projectId]);

  const addDictionaryButtonClick = () => {
    toggleDialogVisible();
  };

  return (
    <>
      {dialogVisible ? <AddDictionaryDialog projectId={projectId} /> : <></>}
      <List>
        {dictionaries.map((dict, idx) => (
          <>
            <ListItem>
              <ListItemText primary={dict.tagName} secondary={`${dict.words ? dict.words.join(', ') : ''}...`} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => deleteDictionary({ projectId, dictionaryId: dict.id })}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {idx === dictionaries.length - 1 ? null : <Divider variant="inset" component="li" />}
          </>
        ))}
      </List>
      <ButtonGroup style={{ minWidth: 200 }}>
        <Button variant="contained" color="primary" onClick={addDictionaryButtonClick}>
          Add a dictionary
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DictionariesView;

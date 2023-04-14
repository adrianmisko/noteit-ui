import React, { FC, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, Button } from '@material-ui/core';
import { useStoreActions, useStoreState } from '../../store/hooks';
import * as projectService from '../../Project/projectService';
import Tag from '../../types/Tag';
import Document from '../../types/Document'

interface DialogProps {
  deleteTag?: () => void;
  deleteDocuments?:()=>void;
  deleteProject?:()=>void;
  projectId: number;
  tag?: Tag;
  documentsAmount?:number;
}

const DialogConfirm: FC<DialogProps> = ({ deleteTag,deleteDocuments,deleteProject, projectId,tag,documentsAmount }: DialogProps) => {
  const [message,setMessage] = useState<string>("");
  const toggleDialogVisible = useStoreActions(actions => actions.workspaceModel.toggleDialogVisible);
  const toggleDeleteDialogVisible = useStoreActions(actions => actions.projectModel.toggleDeleteDialogVisible)
  const token = useStoreState(state => state.userModel.token);
  const projects = useStoreState(state => state.projectModel.projects)

  useEffect(() => {
    const fetchCount = async () => {
      const response = await projectService.fetchTagUsesCount(projectId, tag!.id, token);
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData.count)
        setMessage(`Are you sure you want to delete tag ${tag!.name}? It is used in this project ${responseData.count} times`)
      } else {
        console.log('error fetching tag uses count');
      }
    };
    if(tag != null){
      fetchCount();
    }
    else if(documentsAmount != null){
      setMessage(`Are you sure you want to delete ${documentsAmount} documents?`)
    }
    else{
      const projectName = getProjectName()
      setMessage(`Are you sure you want to delete the project ${projectName}?`)
    }
  }, []);

  const handleConfirm = () => {
    if(tag != null){
      deleteTag!();
      toggleDialogVisible();
    }
    else if(documentsAmount != null){
      deleteDocuments!();
      toggleDeleteDialogVisible();
    }
    else{
      deleteProject!();
      toggleDeleteDialogVisible();
    }
  };

  const handleClose = () =>{
    if(tag != null){
      toggleDialogVisible();
    }
    else{
      toggleDeleteDialogVisible();
    }
  }

  const getProjectName = () => {
    return projects.filter(projectObject => projectObject.id == projectId )[0].name
  }

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown maxWidth="xs" aria-labelledby="confirmation-dialog-title" open>
      <DialogContent dividers style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" data-testid="confirmDelete">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirm;

import React, { FC, useState } from 'react';
import { Button, Tooltip, Checkbox, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
// @ts-ignore
import saveAs from 'file-saver';
import { Link, useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { message } from 'antd';
import { LockTwoTone, WarningTwoTone } from '@material-ui/icons';
import DialogConfirm from '../DialogConfirm/DialogConfirm';
import AvatarList from '../AvatarList/AvatarList';
import { fetchJsonResult } from '../../Document/jsonResultService';
import Document from '../../types/Document';
import { DocumentAnnotator } from '../../Project/ProjectModel';
import Role from '../../types/Role';
import { useStoreActions, useStoreState } from '../../store/hooks';


interface DocumentListProps {
  documents: Document[];
  documentsAnnotators: DocumentAnnotator[];
  accessToken: string;
  documentsWithConflicts: number[];
  resolvedDocuments: number[];
  deleteDocument: (documentId: number) => void;
  role: Role;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '72vh',
    overflowY: 'scroll',
  },
}));

const DocumentList: FC<DocumentListProps> = ({
  role,
  accessToken,
  documents,
  documentsAnnotators,
  deleteDocument,
  resolvedDocuments,
  documentsWithConflicts,
}: DocumentListProps) => {
  const styles = useStyles();

  let { projectId } = useParams();
  projectId = Number(projectId);

  const [toBeExported, setToBeExported] = useState<number[]>([]);
  const deleteDialogVisible = useStoreState(state => state.projectModel.deleteDialogVisible);
  const toggleDeleteDialogVisible = useStoreActions(actions => actions.projectModel.toggleDeleteDialogVisible);

  const submitFetchJson = async () => {
    if (toBeExported.length > 0) {
      const response = await fetchJsonResult(projectId, toBeExported, 1, accessToken);
      if (response.status === 200) {
        const annotations = await response.json();
        const blob = new Blob([JSON.stringify(annotations)], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'annotationResult.json');
      } else {
        message.error('Error fetching annotation result');
      }
    }
  };

  const toggleListItem = (idx: number) => {
    if (toBeExported.includes(idx)) {
      setToBeExported(toBeExported.filter(i => i !== idx));
    } else {
      setToBeExported([...toBeExported, idx]);
    }
  };

  const toggleAll = () => {
    if (toBeExported.length === documents.length) {
      setToBeExported([]);
    } else {
      setToBeExported(documents.map(doc => doc.id));
    }
  };

  const deleteMarked = () =>
    toBeExported.forEach((documentId: number) => {
      deleteDocument(documentId);
    });

  const deleteDocumentsButton = () => {
    toggleDeleteDialogVisible();
  };

  const documentConflicts = (doc: Document) => (
    <Link to={`/projects/${projectId}/workspace/${doc.id}/review`} style={{ display: 'flex', flexDirection: 'column' }}>
      <Tooltip title="Konflikt" placement="top">
        <WarningTwoTone style={{ color: 'red', margin: '0 auto' }} />
      </Tooltip>
    </Link>
  );

  const locker = (doc: Document | null) =>
    role === 'USER' ? (
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <Tooltip title="This document has already been approved" placement="top">
          <LockTwoTone style={{ margin: '0 auto' }} />
        </Tooltip>
      </span>
    ) : (
      <Link
        to={`/projects/${projectId}/workspace/${doc ? doc.id : ''}/review`}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Tooltip title="This document has already been approved. Click here to review changes" placement="top">
          <LockTwoTone style={{ margin: '0 auto' }} />
        </Tooltip>
      </Link>
    );

  const documentStateIcon = (doc: Document) => (
    <div style={{ marginTop: 6, width: '10%' }}>
      {role === 'USER'
        ? resolvedDocuments.includes(doc.id)
          ? locker(doc)
          : null
        : resolvedDocuments.includes(doc.id)
          ? locker(doc)
          : documentsWithConflicts.includes(doc.id)
            ? documentConflicts(doc)
            : null}
    </div>
  );

  const actions = (
    <div>
      <Button onClick={toggleAll} style={{ margin: '1em 0 0 1em' }}>
        Toggle all
      </Button>
      {documents.length ? (
        <Button onClick={submitFetchJson} style={{ margin: '1em 0 0 1em' }}>
          Export
        </Button>
      ) : null}
      {role === 'ADMIN' && (
        <Button onClick={deleteDocumentsButton} style={{ margin: '1em 0 0 1em' }}>
          Delete Marked
        </Button>
      )}
    </div>
  );

  return (
    <>
      {deleteDialogVisible ? <DialogConfirm projectId={projectId} deleteDocuments={deleteMarked} documentsAmount={toBeExported.length} /> : <></>}
      <List className={styles.root}>
        {documents.map((document: Document, idx: number) => {
          const documentAnnotators = documentsAnnotators
            ? documentsAnnotators.find(d => d.documentId === document.id)
            : undefined;
          const imageUrls = documentAnnotators ? documentAnnotators.userEmailsAndImages.map(a => a.imageUrl) : [];
          return (
            <ListItem style={{ padding: '0 1em' }} key={document.id}>
              <ListItemIcon>
                <Checkbox
                  checked={toBeExported.includes(document.id)}
                  onChange={() => {
                    toggleListItem(document.id);
                  }}
                  edge="start"
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText style={{ flex: 'none', marginRight: '1vh' }} primary={`${idx}.`} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Link
                  style={{ color: 'black', marginRight: '1em', width: '45%' }}
                  to={`/projects/${projectId}/workspace/${document.id}`}
                >
                  <ListItemText primary={document.name} />
                </Link>
                {documentStateIcon(document)}
                <AvatarList imageUrls={imageUrls} />
                <div style={{ fontSize: 12, marginTop: -10, width: '20%' }}>
                  <br />
                  Last up. <Moment fromNow date={document.updatedAt} />
                </div>
              </div>
            </ListItem>
          );
        })}
      </List>
      {actions}
    </>
  );
};

export default DocumentList;

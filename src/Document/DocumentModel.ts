import { action, Action, thunk, Thunk } from 'easy-peasy';
import Document from '../types/Document';
import { Injections } from '../store/store';
import { StoreModel } from '../store/storeModel';
import { message } from 'antd';

export interface DocumentModel {
  documents: Document[];
  currentDocument: Document | null;

  addDocumentToList: Action<DocumentModel, Document>;
  addDocumentsToList: Action<DocumentModel, Document[]>;
  setDocuments: Action<DocumentModel, Document[]>;
  setDocument: Action<DocumentModel, Document>;
  fetchDocuments: Thunk<DocumentModel, number, Injections, StoreModel>;
  fetchDocument: Thunk<DocumentModel, DocumentThunkPayload, Injections, StoreModel>;
  deleteDocument: Thunk<DocumentModel, DocumentThunkPayload, Injections, StoreModel>;
  removeDocumentFromList: Action<DocumentModel, number>;
}

export interface DocumentThunkPayload {
  projectId: number;
  documentId: number;
}

const documentModel: DocumentModel = {
  documents: [],
  currentDocument: null,
  addDocumentToList: action((state, document) => {
    state.documents.push({ ...document, annotations: { 0: [] } });
    state.documents = state.documents.sort((a, b) => a.name.localeCompare(b.name));
  }),
  addDocumentsToList: action((state, documents) => {
    state.documents.push(...documents);
  }),
  setDocuments: action((state, documents) => {
    state.documents = documents;
  }),
  fetchDocuments: thunk(async (actions, projectId, { injections, getStoreState, getStoreActions }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getAllProjectDocuments(projectId, token);
    if (response.status === 200) {
      let documents: Document[] = await response.json();
      documents = documents.sort((a, b) => a.name.localeCompare(b.name));
      actions.setDocuments(documents);
    } else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Documents fetching Permission Error`);
    } else {
      message.info('Error fetching documents');
    }
  }),
  fetchDocument: thunk(async (actions, { projectId, documentId }, { injections, getStoreState, getStoreActions }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getOneDocument(projectId, documentId, token);
    if (response.status === 200) {
      const document: Document = await response.json();
      actions.setDocument(document);
    }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Fetch document Permission Error`);
    } else {
      message.info(`Error fetching document ${documentId}`);
    }
  }),
  deleteDocument: thunk(async (actions, { projectId, documentId }, { injections, getStoreState, getStoreActions }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.deleteDocument(projectId, documentId, token);
    if (response.status === 204) {
      actions.removeDocumentFromList(documentId);
    }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Delete document Permission Error`);
    } else {
      message.info(`Error deleting document`);
    }
  }),
  removeDocumentFromList: action((state, documentId) => {
    const documentIdx = state.documents.findIndex(d => d.id === documentId);
    state.documents.splice(documentIdx, 1);
  }),
  setDocument: action((state, document) => {
    state.currentDocument = document;
  }),
};

export default documentModel;

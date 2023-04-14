import HOSTNAME from '../config';

export const getDocumentsAnnotations = async (
  projectId: number,
  documentId: number,
  token: string,
): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

interface FinalAnnotation {
  start: number;
  end: number;
  tagId: number;
  isFinal: boolean;
}

export const saveFinalAnnotations = async (
  projectId: number,
  documentId: number,
  annotations: FinalAnnotation[],
  token: string,
): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annotations),
  };
  return fetch(url, options);
};

export const getDocumentsWithConflicts = async (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/conflicts`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

export const getResolvedDocuments = async (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/final`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

export const getFinalAnnotations = async (projectId: number, documentId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations/final`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

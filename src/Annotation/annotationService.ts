import Annotation from '../types/Annotation';
import HOSTNAME from '../config';

export const fetchAll = (projectId: number, documentId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations/current-user`;
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

export const saveAnnotation = async (
  projectId: number,
  documentId: number,
  annotation: Annotation,
  token: string,
): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annotation),
  };
  return fetch(url, options);
};

export const deleteAnnotation = async (
  projectId: number,
  documentId: number,
  annotation: Annotation,
  token: string,
): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'delete',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(annotation),
  };
  return fetch(url, options);
};

export const sendAnnotations = async (
  projectId: number,
  documentId: number,
  annotations: Annotation[],
  token: string,
): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}/annotations`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'delete',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(annotations),
  };
  return fetch(url, options);
};

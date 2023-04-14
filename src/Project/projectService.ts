import HOSTNAME from '../config';
import Project from '../types/Project';
import Role from '../types/Role';

// TODO export documentService to separate module
// move modules to fitting packages

export const getAllProjectDocuments = (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents`;
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

export const deleteDocument = async (projectId: number, documentId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'delete',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

export const getAllProjects = (token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects`;
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

export const getOne = (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}`;
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

export const getOneDocument = (projectId: number, documentId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/${documentId}`;
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

export const addProject = async (project: Project, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  };
  return fetch(url, options);
};

export const deleteProject = async (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'delete',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

export const getUsersForSelect = (token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/users`;
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

export const addUsers = (emails: string[], projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/users/`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'post',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emails }),
  };
  return fetch(url, options);
};

export const getUsers = (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/users`;
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

export const removeUserFromProject = (projectId: number, email: string, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/users/${email}`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'delete',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(url, options);
};

export const changeUsersRole = (projectId: number, email: string, role: Role, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'post',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, role: role === 'ADMIN' ? 'ROLE_MANAGER' : 'ROLE_USER' }),
  };
  return fetch(url, options);
};

export const fetchTagUsesCount = (projectId: number, tagId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/tags/${tagId}/count`;
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

export const getDocumentsAnnotators = (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/annotators`;
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

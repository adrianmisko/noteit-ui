import Tag from '../types/Tag';
import HOSTNAME from '../config';

export const fetchTags = (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/tags`;
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

export const saveTag = async (projectId: number, tag: Tag, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/tags`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  };
  return fetch(url, options);
};

export const deleteTag = async (projectId: number, tagId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/tags/${tagId}`;
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

export const editTag = async (projectId: number, tag: Tag, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/tags`;
  const options: RequestInit = {
    mode: 'cors',
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  };
  return fetch(url, options);
};

export const fetchTagsUses = (projectId: number, tagId: number, token: string): Promise<Response> => {
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

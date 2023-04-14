import HOSTNAME from '../config';

export const fetchProjectsDictionaries = (projectId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/dictionaries`;
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

export const deleteDictionary = (projectId: number, dictionaryId: number, token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/dictionaries/${dictionaryId}`;
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

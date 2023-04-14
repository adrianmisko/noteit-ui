import HOSTNAME from '../config';

export const fetchJsonResult = (projectId: number, documentIds: number[], userId: number,token:string): Promise<Response> => {
  const url = `${HOSTNAME}/api/projects/${projectId}/documents/json`;
  const payload = { documentIds };
  const options: RequestInit = {
    mode: 'cors',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify(payload),
  };
  return fetch(url, options);
};

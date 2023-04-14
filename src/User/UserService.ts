import HOSTNAME from '../config';

export const fetchUserDetails = (token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/users/current-user`;
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

export const fetchRole = (token: string): Promise<Response> => {
  const url = `${HOSTNAME}/api/users/current-user`;
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

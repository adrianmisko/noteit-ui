import randomColor from 'randomcolor';
import Tag from '../types/Tag';

const id = () => Math.floor(Math.random() * Math.floor(10000));

export const fetchTags = (): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 200,
          json: async () =>
            new Promise(resolve =>
              setTimeout(
                () =>
                  resolve([
                    { id: id(), name: 'Animal', color: randomColor({ format: 'rgba', alpha: 0.4 }) },
                    { id: id(), name: 'Person', color: randomColor({ format: 'rgba', alpha: 0.4 }) },
                  ]),
                100,
              ),
            ),
        }),
      500,
    ),
  );
};

export const saveTag = async (tag: Tag): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 201,
          json: async () => new Promise(resolve => setTimeout(() => resolve({ ...tag, id: id() }), 100)),
        }),
      300,
    ),
  );
};

export const deleteTag = async (tagId: number): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 200,
        }),
      400,
    ),
  );
};

export const editTag = async (tag: Tag): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 201,
          json: async () => new Promise(tag => setTimeout(() => tag(tag), 100)),
        }),
      350,
    ),
  );
};

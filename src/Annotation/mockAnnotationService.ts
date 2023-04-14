import Annotation from '../types/Annotation';

export const fetchAnnotations = (fileId: number): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 200,
          json: async () => new Promise(resolve => setTimeout(() => resolve([]), 100)),
        }),
      500,
    ),
  );
};

export const saveAnnotation = async (fileId: number, annotation: Annotation): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 201,
          json: async () => new Promise(resolve => setTimeout(() => resolve(annotation), 100)),
        }),
      300,
    ),
  );
};

export const deleteAnnotation = async (fileId: number, annotation: Annotation): Promise<any> => {
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

export const sendAnnotations = async (fileId: number, annotations: Annotation[]): Promise<any> => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          status: 201,
          json: async () => new Promise(resolve => setTimeout(() => resolve(annotations), 100)),
        }),
      300,
    ),
  );
};

import Document from '../types/Document';

export const getAllProjectDocuments = (projectId: number): Promise<any> => {
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
                        {
                            id: 3,
                            annotations: { 0: [] },
                            tags: { 0: [] },
                            text:"lorem ipsum4"
                          },
                          {
                            id: 4,
                            annotations: { 0: [] },
                            tags: { 0: [] },
                            text:"lorem ipsum5"
                          },
                          {
                            id: 5,
                            annotations: { 0: [] },
                            tags: { 0: [] },
                            text:"lorem ipsum6"
                          }
                    ]),
                  100,
                ),
              ),
          }),
        500,
      ),
    );
  };

  export const deleteDocument = async (projectId: number,documentId: number): Promise<any> => {
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

  export const deleteProject = async (projectId: number): Promise<any> => {
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


  export const addProject = async (projectId: number): Promise<any> => {
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

  export const addDocument = async (file: File): Promise<any> => {
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
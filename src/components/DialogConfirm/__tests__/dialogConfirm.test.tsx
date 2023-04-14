import React from 'react';
import { render, cleanup,fireEvent,waitForDomChange } from '@testing-library/react';
import { Button } from '@material-ui/core';
import DialogConfirm from '../DialogConfirm';
import Document from '../../../types/Document'
import Annotation from '../../../types/Annotation'
import { MemoryRouter } from 'react-router-dom'
import { StoreProvider } from 'easy-peasy';
import store from '../../../store/store';
import { fakeServer } from 'sinon';
import HOSTNAME from '../../../config';

import workspaceModel, { WorkspaceModel } from '../Workspace/WorkspaceModel';
import documentModel, { DocumentModel } from '../Document/DocumentModel';
import annotationModel, { AnnotationModel } from '../Annotation/AnnotationModel';
import tagModel, { TagModel } from '../Tag/TagModel';
import userModel, { UserModel } from '../User/UserModel';
import reviewModel, { ReviewModel } from '../Review/ReviewModel';
import dictionaryModel, { DictionaryModel } from '../Dictionary/DictionaryModel';


describe('DialogConfirm component', () => {
  beforeEach(cleanup);

  const documents: Document[] = [{id: 1,name: "1",extension: 'txt',text: "aaa",annotations: {},updatedAt: "1"},
   {id: 2,name: "2",extension: 'txt',text: "aaa",annotations: {},updatedAt: "1"}];
  const documentsAnnotators:any[] = [];

  it('Renders without crashing', () => {
    render(<MemoryRouter initialEntries={["/projects/1"]}>
            <StoreProvider store={store}>
                <DialogConfirm documents={documents} documentsAnnotators={documentsAnnotators} />
            </StoreProvider>
          </MemoryRouter>);
  });

 it('Shows delete popup', async () => {

    const deleteDocuments = () => {
      console.log("dupa")
    }

    const { getByTestId } = await render(
    	<MemoryRouter initialEntries={["/projects/1"]}>
    		<StoreProvider store={store}>
              <DialogConfirm documentsAmount={2} projectId={1} deleteDocuments={deleteDocuments} />
          </StoreProvider>
      </MemoryRouter>);
    const url = `${HOSTNAME}/api/projects/1/documents/1`;
    const url2 = `${HOSTNAME}/api/projects/1/documents/2`;

    let server = fakeServer.create();

    server.respondWith('POST', url, [
        204,
        {},
        JSON.stringify({'response': 'ok'})
    ]);
    server.respondWith('POST', url2, [
        204,
        {},
        JSON.stringify({'response': 'ok'})
    ]);

    const confirm = getByTestId("Confirm");
    const dialog = getByTestId("dialog");


    await fireEvent.click(confirm);
    waitForDomChange({ dialog }).then(() => expect(queryByTestId("dialog")).toBeNull())
  });

});

import { createStore } from 'easy-peasy';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import storeModel from './storeModel';

import * as tagService from '../Tag/tagService';
import * as annotationService from '../Annotation/annotationService';
import * as projectService from '../Project/projectService';
import * as userService from '../User/UserService';
import * as reviewService from '../Review/reviewService';
import * as dictionaryService from '../Dictionary/dictionaryService';


export interface Injections {
  tagService: typeof tagService;
  annotationService: typeof annotationService;
  projectService: typeof projectService;
  userService: typeof userService;
  reviewService: typeof reviewService;
  dictionaryService: typeof dictionaryService;
}

const store = createStore(storeModel, {
  reducerEnhancer: reducer =>
    persistReducer(
      {
        key: 'easypeasystate',
        storage,
      },
      reducer,
    ),
  injections: { tagService, annotationService, projectService, userService, reviewService, dictionaryService },
});

export default store;

import Dictionary from '../types/Dictionary';
import { action, Action, thunk, Thunk } from 'easy-peasy';
import { Injections } from '../store/store';
import { StoreModel } from '../store/storeModel';
import { message } from 'antd';

interface DeleteDictionaryThunkPayload {
  projectId: number;
  dictionaryId: number;
}

export interface DictionaryModel {
  dictionaries: Dictionary[];

  fetchDictionaries: Thunk<DictionaryModel, number, Injections, StoreModel>;
  setDictionaries: Action<DictionaryModel, Dictionary[]>;
  addDictionaryToList: Action<DictionaryModel, Dictionary>;
  deleteDictionary: Thunk<DictionaryModel, DeleteDictionaryThunkPayload, Injections, StoreModel>;
  removeDictionaryFromList: Action<DictionaryModel, number>;
}

const dictionaryModel: DictionaryModel = {
  dictionaries: [],
  fetchDictionaries: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { dictionaryService } = injections;
    const { token } = getStoreState().userModel;
    const response = await dictionaryService.fetchProjectsDictionaries(projectId, token);
    if (response.status === 200) {
      const dictionaries: Dictionary[] = await response.json();
      console.log(dictionaries)
      actions.setDictionaries(dictionaries);
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('Wystąpił problem przy pobieraniu słowników', 2);
    }
  }),
  setDictionaries: action((state, dictionaries) => {
    state.dictionaries = dictionaries;
  }),
  addDictionaryToList: action((state, dictionary) => {
    state.dictionaries.push(dictionary);
  }),
  deleteDictionary: thunk(async (actions, { projectId, dictionaryId }, { injections, getStoreState }) => {
    const { dictionaryService } = injections;
    const { token } = getStoreState().userModel;
    const response = await dictionaryService.deleteDictionary(projectId, dictionaryId, token);
    if (response.status === 204) {
      actions.removeDictionaryFromList(dictionaryId)
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('Wystąpił problem przy pobieraniu słowników', 2);
    }
  }),
  removeDictionaryFromList: action((state, dictionaryId) => {
    const idx = state.dictionaries.findIndex(dict => dict.id === dictionaryId);
    state.dictionaries.splice(idx, 1);
  }),
};

export default dictionaryModel;

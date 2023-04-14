import { Action, action, Computed, computed } from 'easy-peasy';
import Chunk from '../types/Chunk';
import { StoreModel } from '../store/storeModel';
import findAnnotatedTokens from './utils/findAnnotatedTokens';
import { findAll } from './utils/splitTextIntoChunks';

export interface WorkspaceModel {
  userId: number;
  selection: [number, number];
  popupVisible: boolean;
  drawerVisible: boolean;
  fontSize: number;
  chunks: Computed<WorkspaceModel, Chunk[], StoreModel>;
  dialogVisible: boolean;

  setSelection: Action<WorkspaceModel, [number, number]>;
  togglePopupVisible: Action<WorkspaceModel>;
  toggleDrawerVisible: Action<WorkspaceModel>;
  toggleDialogVisible: Action<WorkspaceModel>;
  increaseFontSize: Action<WorkspaceModel>;
  decreaseFontSize: Action<WorkspaceModel>;
}

const workspaceModel: WorkspaceModel = {
  userId: 0,
  selection: [0, 0],
  popupVisible: false,
  drawerVisible: false,
  dialogVisible: false,
  fontSize: 14,
  // @ts-ignore
  chunks: computed(
    [
      (_, storeState) => storeState.annotationModel.annotations,
      (_, storeState) => storeState.documentModel.currentDocument,
    ],
    (annotations, document) => {
      if (!document || !annotations) {
        return [];
      }
      return findAll({ annotations, findChunks: findAnnotatedTokens, textToHighlight: document.text });
    },
  ),
  // @ts-ignore
  setSelection: action((state, selection) => {
    state.selection = selection;
  }),
  increaseFontSize: action(state => {
    state.fontSize += 2;
  }),
  decreaseFontSize: action(state => {
    state.fontSize -= 2;
  }),
  togglePopupVisible: action(state => {
    state.popupVisible = !state.popupVisible;
  }),
  toggleDrawerVisible: action(state => {
    state.drawerVisible = !state.drawerVisible;
  }),
  toggleDialogVisible: action(state => {
    state.dialogVisible = !state.dialogVisible;
  }),
};

export default workspaceModel;

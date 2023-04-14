import { action, Action, thunk, Thunk, thunkOn, ThunkOn } from 'easy-peasy';
import Annotation from '../types/Annotation';
import { Injections } from '../store/store';
import { StoreModel } from '../store/storeModel';
import { message } from 'antd';

export interface AnnotationModel {
  annotations: Annotation[];

  toggleAnnotation: Thunk<AnnotationModel, ToggleAnnotationActionPayload, Injections, StoreModel>;
  addAnnotation: Action<AnnotationModel, ToggleAnnotationActionPayload>;
  setAnnotations: Action<AnnotationModel, SetAnnotationsActionPayload>;
  removeAnnotation: Action<AnnotationModel, ToggleAnnotationActionPayload>;
  sendAnnotation: ThunkOn<AnnotationModel, Injections, StoreModel>;
  clearAnnotations: Action<AnnotationModel, AnnotationThunkPayload>;
  fetchAnnotations: Thunk<AnnotationModel, AnnotationThunkPayload, Injections, StoreModel>;
}

export interface ToggleAnnotationActionPayload {
  projectId: number;
  documentId: number;
  annotation: Annotation;
}

export interface SetAnnotationsActionPayload {
  projectId: number;
  documentId: number;
  annotations: Annotation[];
}

export interface AnnotationThunkPayload {
  projectId: number;
  documentId: number;
}

const annotationModel: AnnotationModel = {
  annotations: [],

  toggleAnnotation: thunk(async (actions, { projectId, documentId, annotation }, { getStoreState }) => {
    const ann = getStoreState().annotationModel.annotations.find(
      (a: Annotation) => a.start === annotation.start && a.end === annotation.end && a.tagId === annotation.tagId,
    );
    if (ann) {
      actions.removeAnnotation({ annotation, projectId, documentId });
    } else {
      actions.addAnnotation({ annotation, projectId, documentId });
    }
  }),
  addAnnotation: action((state, { annotation, documentId, projectId }) => {
    state.annotations.push(annotation);
  }),
  removeAnnotation: action((state, { annotation, projectId, documentId }) => {
    const idx = state.annotations.findIndex(
      a => a.tagId === annotation.tagId && a.start === annotation.start && a.end === annotation.end,
    );
    state.annotations.splice(idx, 1);
  }),
  clearAnnotations: action((state, { projectId, documentId }) => {
    state.annotations = [];
  }),
  setAnnotations: action((state, { annotations, documentId, projectId }) => {
    state.annotations = annotations;
  }),
  sendAnnotation: thunkOn(
    actions => [actions.addAnnotation, actions.removeAnnotation, actions.clearAnnotations],
    async (actions, target, { injections, getStoreState }) => {
      const { annotationService } = injections;
      const [annotationAdded, annotationRemoved, clearAnnotations] = target.resolvedTargets;
      const { token } = getStoreState().userModel;
      // @ts-ignore
      const { annotation, projectId, documentId } = target.payload;
      // TODO if this fails, we should bulk upload annotations on reconnect
      switch (target.type) {
        case annotationAdded:
          await annotationService.saveAnnotation(projectId, documentId, annotation, token);
          break;
        case annotationRemoved:
          await annotationService.deleteAnnotation(projectId, documentId, annotation, token);
          break;
        case clearAnnotations:
          // todo remove all call
          break;
        default:
          break;
      }
    },
  ),
  fetchAnnotations: thunk(
    async (actions, { projectId, documentId }, { injections, getStoreState, getStoreActions }) => {
      const { annotationService } = injections;
      const { token } = getStoreState().userModel;
      const response = await annotationService.fetchAll(projectId, documentId, token);
      if (response.status === 200) {
        const annotations = await response.json();
        actions.setAnnotations({ annotations, projectId, documentId });
      }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Annotation fetching Permission Error`);
      } else {
        // TODO snackbar should use state && error here aka handling of server side errors
        message.info(`Error fetching Annotations`);
      }
    },
  ),
};

export default annotationModel;

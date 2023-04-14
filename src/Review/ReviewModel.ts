import { message } from 'antd';
import { action, Action, computed, Computed, thunk, Thunk } from 'easy-peasy';
import { uniqWith } from 'lodash';
import Annotation from '../types/Annotation';
import Chunk from '../types/Chunk';
import { Injections } from '../store/store';
import { StoreModel } from '../store/storeModel';
import { findAll } from '../Workspace/utils/splitTextIntoChunks';
import findAnnotatedTokens from '../Workspace/utils/findAnnotatedTokens';
import calculateConflicts from './utils/calculateConflicts';
import getConflictlessAndChosenAnnotations from './utils/getConflictlessAnnotations';

const startEndTagId = (a: Annotation, b: Annotation) => a.tagId === b.tagId && a.start === b.start && a.end === b.end;

export interface UserAnnotation {
  user: string;
  annotation: Annotation;
}

export interface ConflictingAnnotation {
  user: string;
  annotations: Annotation[];
}

export interface Conflict {
  id: number;
  conflicts: ConflictingAnnotation[];
}

export interface ReviewModel {
  annotations: { [key: string]: Annotation[] };
  finalAnnotations: Computed<ReviewModel, Annotation[], StoreModel>;
  text: Computed<ReviewModel, string, StoreModel>;
  finalChunks: Computed<ReviewModel, Chunk[], StoreModel>;
  conflicts: Computed<ReviewModel, Conflict[], StoreModel>;
  resolvedConflicts: number[];
  chosenAnnotations: Annotation[];
  documentsWithConflicts: number[];
  shouldRedirectToWorkspace: boolean;
  imageUrls: { [key: string]: string };
  resolvedDocuments: number[];

  fetchAnnotations: Thunk<ReviewModel, AnnotationsThunkPayload, Injections, StoreModel>;
  setAnnotations: Action<ReviewModel, { [key: string]: Annotation[] }>;
  markAsResolved: Action<ReviewModel, number>;
  toggleAnnotation: Action<ReviewModel, Annotation>;
  saveFinalAnnotations: Thunk<ReviewModel, AnnotationsThunkPayload, Injections, StoreModel>;
  setImageUrls: Action<ReviewModel, { [key: string]: string }>;

  fetchDocumentsWithConflicts: Thunk<ReviewModel, number, Injections, StoreModel>;
  setDocumentsWithConflicts: Action<ReviewModel, number[]>;
  setShouldRedirectToWorkspace: Action<ReviewModel, boolean>;

  fetchResolvedDocuments: Thunk<ReviewModel, number, Injections, StoreModel>;
  setResolvedDocuments: Action<ReviewModel, number[]>;

  fetchFinalAnnotations: Thunk<ReviewModel, AnnotationsThunkPayload, Injections, StoreModel>;
  setChosenAnnotations: Action<ReviewModel, Annotation[]>;
}

export interface AnnotationsThunkPayload {
  projectId: number;
  documentId: number;
}

interface ConflictsDto {
  documentId: number;
}

const sortByFirstAnnotationStart = (a: Conflict, b: Conflict): number => {
  const firstAnnotationFromA: Annotation = a.conflicts
    .flatMap(c => c.annotations)
    .sort((a0, b0) => a0.start - b0.start)[0];
  const firstAnnotationFromB: Annotation = b.conflicts
    .flatMap(c => c.annotations)
    .sort((a0, b0) => a0.start - b0.start)[0];
  return firstAnnotationFromA.start - firstAnnotationFromB.start;
};

// @ts-ignore
const reviewModel: ReviewModel = {
  annotations: {},
  resolvedConflicts: [],
  chosenAnnotations: [],
  documentsWithConflicts: [],
  shouldRedirectToWorkspace: false,
  imageUrls: {},
  resolvedDocuments: [],
  finalAnnotations: computed(state =>
    uniqWith(
      [...getConflictlessAndChosenAnnotations(state.annotations, state.chosenAnnotations), ...state.chosenAnnotations],
      startEndTagId,
    ),
  ),
  text: computed([(_, storeState) => storeState.documentModel.currentDocument], doc => (doc ? doc.text : '')),
  finalChunks: computed(state =>
    findAll({
      annotations: state.finalAnnotations,
      findChunks: findAnnotatedTokens,
      textToHighlight: state.text,
    }),
  ),
  conflicts: computed(state => {
    return calculateConflicts(state.annotations).sort(sortByFirstAnnotationStart);
  }),
  setAnnotations: action((state, annotations) => {
    state.annotations = annotations;
  }),
  fetchAnnotations: thunk(async (actions, { projectId, documentId }, { injections, getStoreState }) => {
    const { reviewService } = injections;
    const { token } = getStoreState().userModel;
    const response = await reviewService.getDocumentsAnnotations(projectId, documentId, token);
    if (response.status === 200) {
      const annotations = await response.json();
      const mappedAnnotations: { [key: string]: Annotation[] } = {};
      const imageUrls: { [key: string]: string } = {};
      // @ts-ignore
      annotations.forEach(ann => {
        mappedAnnotations[ann.user.email] = ann.annotations;
        imageUrls[ann.user.email] = ann.user.imageUrl;
      });
      actions.setAnnotations(mappedAnnotations);
      actions.setImageUrls(imageUrls);
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('Wystąpił problem przy pobieraniu antoacji użytkowników', 2);
    }
  }),
  markAsResolved: action((state, conflictId) => {
    state.resolvedConflicts.push(conflictId);
  }),
  toggleAnnotation: action((state, annotation) => {
    const idx = state.chosenAnnotations.findIndex(
      ann => ann.start === annotation.start && ann.end === annotation.end && ann.tagId === annotation.tagId,
    );
    if (idx !== -1) {
      state.chosenAnnotations.splice(idx, 1);
    } else {
      state.chosenAnnotations.push(annotation);
    }
  }),
  saveFinalAnnotations: thunk(async (actions, { projectId, documentId }, { injections, getStoreState }) => {
    const { reviewService } = injections;
    const { token } = getStoreState().userModel;
    const finalAnnotations = getStoreState().reviewModel.finalAnnotations.map(a => ({ ...a, isFinal: true }));
    const response = await reviewService.saveFinalAnnotations(projectId, documentId, finalAnnotations, token);
    if (response.status === 200) {
      message.success('Zapisano', 2);
      actions.setShouldRedirectToWorkspace(true);
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('Wystąpił problem przy zapisywaniu antoacji użytkowników', 2);
    }
  }),
  fetchDocumentsWithConflicts: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { reviewService } = injections;
    const { token } = getStoreState().userModel;
    const response = await reviewService.getDocumentsWithConflicts(projectId, token);
    if (response.status === 200) {
      const documentsWithConflicts: ConflictsDto[] = await response.json();
      actions.setDocumentsWithConflicts(documentsWithConflicts.map(dto => dto.documentId));
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('Wystąpił problem przy pobieraniu informacji o konfliktach', 2);
    }
  }),
  setDocumentsWithConflicts: action((state, documentsWithConflicts) => {
    state.documentsWithConflicts = documentsWithConflicts;
  }),
  setShouldRedirectToWorkspace: action((state, shouldRedirect) => {
    state.shouldRedirectToWorkspace = shouldRedirect;
  }),
  setImageUrls: action((state, imageUrls) => {
    state.imageUrls = imageUrls;
  }),
  fetchResolvedDocuments: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { reviewService } = injections;
    const { token } = getStoreState().userModel;
    const response = await reviewService.getResolvedDocuments(projectId, token);
    if (response.status === 200) {
      const documentsWithConflicts: ConflictsDto[] = await response.json();
      actions.setResolvedDocuments(documentsWithConflicts.map(dto => dto.documentId));
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('Wystąpił problem przy pobieraniu informacji o konfliktach', 2);
    }
  }),
  setResolvedDocuments: action((state, resolvedDocuments) => {
    state.resolvedDocuments = resolvedDocuments;
  }),
  fetchFinalAnnotations: thunk(async (actions, { projectId, documentId }, { injections, getStoreState }) => {
    const { reviewService } = injections;
    const { token } = getStoreState().userModel;
    const response = await reviewService.getFinalAnnotations(projectId, documentId, token);
    if (response.status === 200) {
      const finalAnnotations: Annotation[] = await response.json();
      actions.setChosenAnnotations(finalAnnotations);
    } else if (response.status === 401) {
      message.error('Błąd uprawnień', 2);
    } else {
      message.error('An error occured while getting final annotations', 2);
    }
  }),
  setChosenAnnotations: action((state, chosenAnnotations) => {
    state.chosenAnnotations = chosenAnnotations;
  }),
};

export default reviewModel;

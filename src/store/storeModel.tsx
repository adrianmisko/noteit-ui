import workspaceModel, { WorkspaceModel } from '../Workspace/WorkspaceModel';
import projectModel, { ProjectModel } from '../Project/ProjectModel';
import documentModel, { DocumentModel } from '../Document/DocumentModel';
import annotationModel, { AnnotationModel } from '../Annotation/AnnotationModel';
import tagModel, { TagModel } from '../Tag/TagModel';
import userModel, { UserModel } from '../User/UserModel';
import reviewModel, { ReviewModel } from '../Review/ReviewModel';
import dictionaryModel, { DictionaryModel } from '../Dictionary/DictionaryModel';

export interface StoreModel {
  workspaceModel: WorkspaceModel;
  projectModel: ProjectModel;
  documentModel: DocumentModel;
  annotationModel: AnnotationModel;
  tagModel: TagModel;
  userModel: UserModel;
  reviewModel: ReviewModel;
  dictionaryModel: DictionaryModel;
}

const storeModel: StoreModel = {
  workspaceModel,
  projectModel,
  documentModel,
  annotationModel,
  tagModel,
  userModel,
  reviewModel,
  dictionaryModel,
};

export default storeModel;

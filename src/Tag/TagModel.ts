import { action, Action, thunk, Thunk } from 'easy-peasy';
import { Injections } from '../store/store';
import Tag from '../types/Tag';
import { StoreModel } from '../store/storeModel';
import { message } from 'antd';

export interface TagModel {
  tags: Tag[];

  addTagsToList: Action<TagModel, Tag[]>;
  fetchTags: Thunk<TagModel, number, Injections, StoreModel>;
  addTagToList: Action<TagModel, Tag>;
  saveTag: Thunk<TagModel, TagThunkPayload, Injections, StoreModel>;
  removeTagFromList: Action<TagModel, number>;
  deleteTag: Thunk<TagModel, TagThunkPayload, Injections, StoreModel>;
  editTagList: Action<TagModel, Tag>;
  editTag: Thunk<TagModel, TagThunkPayload, Injections, StoreModel>;
  setTags: Action<TagModel, Tag[]>;
}

export interface TagThunkPayload {
  projectId: number;
  tag: Tag;
}

export interface TagUsesPayload {
  projectId: number;
  tagId:number;
}

const tagModel: TagModel = {
  tags: [],
  fetchTags: thunk(async (actions, projectId, { injections, getStoreState, getStoreActions }) => {
    const { tagService } = injections;
    const { token } = getStoreState().userModel;
    const response = await tagService.fetchTags(projectId, token);
    if (response.status === 200) {
      const tags = await response.json();
      actions.setTags(tags);
    }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Fetching tags Permission Error`);
    } else {
      // TODO snackbar should use state && error here
      message.info(`Error fetching tags`);
    }
  }),
  addTagsToList: action((state, tags) => {
    state.tags.push(...tags);
  }),
  saveTag: thunk(async (actions, { projectId, tag }, { injections, getStoreState, getStoreActions }) => {
    const { tagService } = injections;
    const { token } = getStoreState().userModel;
    const response = await tagService.saveTag(projectId, tag, token);
    if (response.status === 201) {
      const newTag = await response.json();
      actions.addTagToList(newTag);
    }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Adding tag Permission Error`);
    } else {
      // TODO snackbar should use state && error here
      message.info(`Error adding tag`);
    }
  }),
  addTagToList: action((state, tag) => {
    state.tags.push(tag);
  }),
  removeTagFromList: action((state, tagId) => {
    const removedTagIdx = state.tags.findIndex(tag => tag.id === tagId);
    state.tags.splice(removedTagIdx, 1);
    // TODO should we clear annotations realted to that tag? ask on spring review
  }),
  deleteTag: thunk(async (actions, { projectId, tag }, { injections, getStoreState, getStoreActions }) => {
    const { tagService } = injections;
    const { token } = getStoreState().userModel;
    const response = await tagService.deleteTag(projectId, tag.id, token);
    if (response.status === 204) {
      actions.removeTagFromList(tag.id);
    }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Deleting tag Permission Error`);
    } else {
      message.info(`Error deleting tag`);
    }
  }),
  editTagList: action((state, tag) => {
    let editedTag = state.tags.find(p => p.id === tag.id);
    editedTag = tag;
  }),
  editTag: thunk(async (actions, { projectId, tag }, { injections, getStoreState, getStoreActions }) => {
    const { tagService } = injections;
    const { token } = getStoreState().userModel;
    const response = await tagService.editTag(projectId, tag, token);
    if (response.status === 200) {
      actions.editTagList(tag);
    }else if ((response.status === 401 ) || (response.status === 403)){
        message.info(`Editing tag Permission Error`);
    } else {
      // TODO snackbar should use state && error here aka hadling of server side errors
      message.info(`Error editing tag`);
    }
  }),
  setTags: action((state, tags) => {
    state.tags = tags;
  }),
};

export default tagModel;

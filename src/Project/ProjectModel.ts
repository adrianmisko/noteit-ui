import { Action, action, Thunk, thunk } from 'easy-peasy';
import { message } from 'antd';
import Project from '../types/Project';
import { Injections } from '../store/store';
import { StoreModel } from '../store/storeModel';

import Role from '../types/Role';
import UserDto from '../types/UserDto';

export interface UserBase {
  email: string;
  imageUrl: string;
  role: Role;
}

export interface UserImageAndEmail {
  imageUrl: string;
  email: string;
}

export interface DocumentAnnotator {
  documentId: number;
  userEmailsAndImages: UserImageAndEmail[];
}

export interface ProjectModel {
  projects: Project[];
  currentProject: Project | null;
  emailsForSelect: string[];
  dialogVisible: boolean;
  deleteDialogVisible:boolean;
  users: UserBase[];
  documentAnnotators: DocumentAnnotator[];

  fetchProjects: Thunk<ProjectModel, number, Injections, StoreModel>;
  fetchProject: Thunk<ProjectModel, number, Injections, StoreModel>;
  addProject: Thunk<ProjectModel, Project, Injections, StoreModel>;
  addProjectToList: Action<ProjectModel, Project>;
  setProjects: Action<ProjectModel, Project[]>;
  deleteProject: Thunk<ProjectModel, number, Injections, StoreModel>;
  removeProjectFromList: Action<ProjectModel, number>;
  setCurrentProject: Action<ProjectModel, Project>;
  getUsersForSelect: Thunk<ProjectModel, undefined, Injections, StoreModel>;
  setUsersForSelect: Action<ProjectModel, string[]>;
  addUsersToProject: Thunk<ProjectModel, AddUsersToProjectThunkPayload, Injections, StoreModel>;
  setUsers: Action<ProjectModel, UserBase[]>;
  addUsersToList: Action<ProjectModel, UserBase[]>;
  removeUserFromList: Action<ProjectModel, string>;
  getUsers: Thunk<ProjectModel, number, Injections, StoreModel>;
  removeUserFromProject: Thunk<ProjectModel, RemoveUserFromProjectThunkPayload, Injections, StoreModel>;
  changeUsersRole: Thunk<ProjectModel, ChangeUsersRoleThunkPayload, Injections, StoreModel>;
  setUsersRole: Action<ProjectModel, ChangeUsersRoleThunkPayload>;
  toggleDialogVisible: Action<ProjectModel>;
  toggleDeleteDialogVisible: Action<ProjectModel>;
  fetchDocumentsAnnotators: Thunk<ProjectModel, number, Injections, StoreModel>;
  setDocumentsAnnotators: Action<ProjectModel, DocumentAnnotator[]>;
}

export interface RemoveUserFromProjectThunkPayload {
  email: string;
  projectId: number;
}

export interface AddUsersToProjectThunkPayload {
  emails: string[];
  projectId: number;
}

export interface ChangeUsersRoleThunkPayload {
  projectId: number;
  email: string;
  role: Role;
}

const projectModel: ProjectModel = {
  dialogVisible: false,
  deleteDialogVisible:false,
  projects: [],
  currentProject: null,
  emailsForSelect: [],
  users: [],
  documentAnnotators: [],
  fetchProjects: thunk(async (actions, userId, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getAllProjects(token);
    if (response.status === 200) {
      const projects: Project[] = await response.json();
      actions.setProjects(projects);
    } else if (response.status === 401 || response.status === 403) {
      message.info(`Projects Fetching Permission Error`);
    } else {
      message.info('Error fetching projects');
    }
  }),
  fetchProject: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getOne(projectId, token);
    if (response.status === 200) {
      const project: Project = await response.json();
      actions.setCurrentProject(project);
    } else if (response.status === 401 || response.status === 403) {
      message.info(`Project fetching Permission Error`);
    } else {
      message.info(`error fetching project with id ${projectId}`);
    }
  }),
  addProject: thunk(async (actions, project, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.addProject(project, token);
    if (response.status === 201) {
      const newProject = await response.json();
      actions.addProjectToList(newProject);
    } else if (response.status === 401 || response.status === 403) {
      message.info(`Adding Project Permission Error`);
    } else {
      message.info('Error adding project');
    }
  }),
  addProjectToList: action((state, project) => {
    state.projects.push(project);
  }),
  setProjects: action((state, projects) => {
    state.projects = projects;
  }),
  deleteProject: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.deleteProject(projectId, token);
    if (response.status === 204) {
      actions.removeProjectFromList(projectId);
    } else if (response.status === 401 || response.status === 403) {
      message.info(`Deleting project Permission Error`);
    } else {
      message.info('Error deleting project');
    }
  }),
  removeProjectFromList: action((state, projectId) => {
    const projectIdx = state.projects.findIndex(p => p.id === projectId);
    state.projects.splice(projectIdx, 1);
  }),
  setCurrentProject: action((state, project) => {
    state.currentProject = project;
  }),
  getUsersForSelect: thunk(async (actions, email = undefined, { injections, getStoreState, getState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getUsersForSelect(token);
    if (response.status === 200) {
      const users: UserBase[] = await response.json();
      const emails = users.map(user => user.email).filter(e => !getState().users.find(u => u.email === e));
      actions.setUsersForSelect(emails);
    } else {
      message.info('Error getting users for select');
    }
  }),
  setUsersForSelect: action((state, emails) => {
    state.emailsForSelect = emails;
  }),
  addUsersToProject: thunk(async (actions, { emails, projectId }, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.addUsers(emails, projectId, token);
    if (response.status === 201) {
      const users: UserDto[] = await response.json();
      const usersWithRole: UserBase[] = users.map(u => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const role = u.userRoleDTOs.find(r => r.projectId === projectId)!!.projectRole;
        return {
          ...u,
          role: role === 'ROLE_MANAGER' ? 'ADMIN' : 'USER',
        };
      });
      actions.addUsersToList(usersWithRole);
    } else {
      message.info('Error adding users to project');
    }
  }),
  setUsers: action((state, users) => {
    state.users = users;
  }),
  getUsers: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getUsers(projectId, token);
    if (response.status === 200) {
      const users: UserDto[] = await response.json();
      const usersWithRole: UserBase[] = users.map(u => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const role = u.userRoleDTOs.find(r => r.projectId === projectId)!!.projectRole;
        return {
          ...u,
          role: role === 'ROLE_MANAGER' ? 'ADMIN' : 'USER',
        };
      });
      actions.setUsers(usersWithRole);
    } else {
      message.info('Error fetching users');
    }
  }),
  removeUserFromProject: thunk(async (actions, { email, projectId }, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.removeUserFromProject(projectId, email, token);
    if (response.status === 204) {
      actions.removeUserFromList(email);
    } else {
      message.info('Error deleting users from project');
    }
  }),
  addUsersToList: action((state, users) => {
    state.users.push(...users);
  }),
  removeUserFromList: action((state, email) => {
    const idx = state.users.findIndex(user => user.email === email);
    state.users.splice(idx, 1);
  }),
  changeUsersRole: thunk(async (actions, { projectId, email, role }, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.changeUsersRole(projectId, email, role, token);
    if (response.status === 200) {
      actions.setUsersRole({ projectId, email, role });
    } else {
      message.info('Error changing user role');
    }
  }),
  setUsersRole: action((state, { projectId, email, role }) => {
    const user = state.users.find(u => u.email === email);
    if (!user) {
      return;
    }
    user.role = role;
  }),
  toggleDialogVisible: action(state => {
    state.dialogVisible = !state.dialogVisible;
  }),
  toggleDeleteDialogVisible: action(state => {
    state.deleteDialogVisible = !state.deleteDialogVisible;
  }),
  fetchDocumentsAnnotators: thunk(async (actions, projectId, { injections, getStoreState }) => {
    const { projectService } = injections;
    const { token } = getStoreState().userModel;
    const response = await projectService.getDocumentsAnnotators(projectId, token);
    if (response.status === 200) {
      const documentsAnnotators: DocumentAnnotator[] = await response.json();
      actions.setDocumentsAnnotators(documentsAnnotators);
    } else {
      message.info('Error changing user role');
    }
  }),
  setDocumentsAnnotators: action((state, documentsAnnotators) => {
    state.documentAnnotators = documentsAnnotators;
  }),
};

export default projectModel;

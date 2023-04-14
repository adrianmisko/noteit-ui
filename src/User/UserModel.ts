import { action, Action, thunk, Thunk } from 'easy-peasy';
import { message } from 'antd';
import User from '../types/User';
import UserDto from '../types/UserDto';

export interface UserModel {
  isLoggedIn: boolean;
  token: string;
  user: User;

  setToken: Action<UserModel, string>;
  setIsLoggedIn: Action<UserModel, boolean>;
  setEmail: Action<UserModel, string>;
  setUsername: Action<UserModel, string>;
  setImageUrl: Action<UserModel, string>;
  setUser: Action<UserModel, User>;

  logUserIn: Thunk<UserModel, string>;
  getUserDetails: Thunk<UserModel, string>;
  logUserOut: Thunk<UserModel>;
}

const userModel: UserModel = {
  isLoggedIn: false,
  token: '',
  user: {
    email: '',
    username: '',
    imageUrl: '',
    projectRoles: [],
  },

  setToken: action((state, token) => {
    state.token = token;
  }),
  setIsLoggedIn: action((state, isLoggedIn) => {
    state.isLoggedIn = isLoggedIn;
  }),
  setEmail: action((state, email) => {
    state.user.email = email;
  }),
  setUsername: action((state, username) => {
    state.user.username = username;
  }),
  setImageUrl: action((state, imageUrl) => {
    state.user.imageUrl = imageUrl;
  }),
  setUser: action((state, user) => {
    state.user = user;
  }),

  logUserIn: thunk((actions, token) => {
    actions.setToken(token);
    actions.setIsLoggedIn(true);
    actions.getUserDetails(token);
  }),
  getUserDetails: thunk(async (actions, token, { injections }) => {
    const { userService } = injections;
    const response = await userService.fetchUserDetails(token);
    if (response.status === 200) {
      const user: UserDto = await response.json();
      const userWithRoles: User = {
        ...user,
        projectRoles: user.userRoleDTOs.map(dto => ({
          projectId: dto.projectId,
          role: dto.projectRole === 'ROLE_MANAGER' ? 'ADMIN' : 'USER',
        })),
        username: user.email.split('@')[0],
      };
      actions.setUser(userWithRoles);
    } else if (response.status === 401 || response.status === 403) {
      message.info(`Fetching User Details Permission Error`);
    } else {
      message.info(`Error fetching user details`);
    }
  }),
  logUserOut: thunk(actions => {
    actions.setToken('');
    actions.setIsLoggedIn(false);
  }),
};

export default userModel;

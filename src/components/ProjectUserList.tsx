import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';
import {
  Avatar,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import UserSelect from './UserSelect/UserSelect';
import Role from '../types/Role';
import { UserBase } from '../Project/ProjectModel';
import User from '../types/User';

interface ProjectUserListProps {
  emails: string[];
  changeUsersRole: (email: string, role: Role) => void;
  removeUserFromProject: (email: string) => void;
  addUsersToProject: (emails: string[]) => void;
  fetchEmails: () => void;
  currentUser: User;
  users: UserBase[];
}

const useStyles = makeStyles({});

const ProjectUserList: FC<ProjectUserListProps> = ({
  addUsersToProject,
  changeUsersRole,
  currentUser,
  emails: emailsForSelect,
  fetchEmails,
  removeUserFromProject,
  users,
}: ProjectUserListProps) => {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>, userEmail: string) => {
    setSelectedUser(userEmail);
    setAnchorEl(event.currentTarget as Element);
  };

  const handleClose = () => {
    setSelectedUser('');
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    if (selectedUser !== currentUser.email) {
      removeUserFromProject(selectedUser);
    }
  };

  const handleRoleChangeClick = (e: ChangeEvent<{ value: unknown }>, email: string) => {
    if (email !== currentUser.email) {
      changeUsersRole(email, e.target.value as Role);
    }
  };

  const handleAddUsersToProjectClick = (selectedEmails: string[]) => {
    if (selectedEmails.length) {
      addUsersToProject(selectedEmails);
    }
  };

  const RoleSelect: FC<UserBase> = (user: UserBase) => (
    <FormControl variant="outlined">
      <Select variant="outlined" value={user.role} onChange={e => handleRoleChangeClick(e, user.email)}>
        <MenuItem value="ADMIN">Manager</MenuItem>
        <MenuItem value="USER">Annotator</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <div>
      <Typography component="h4" variant="h4">
        Manage users
      </Typography>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeleteClick}>Delete user</MenuItem>
      </Menu>
      <List>
        {users.map((user: UserBase, idx: number) => (
          // TODO user === current user -> display You, admin
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={user.imageUrl} alt={user.email} />
              </ListItemAvatar>
              <ListItemText primary={user.email} secondary={<RoleSelect {...user} />} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="more" onClick={e => handleMenuClick(e, user.email)}>
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {idx === users.length - 1 ? null : <Divider variant="inset" component="li" />}
          </>
        ))}
      </List>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <UserSelect
          users={emailsForSelect}
          fetchEmails={() => fetchEmails()}
          handleConfirm={handleAddUsersToProjectClick}
        />
      </div>
    </div>
  );
};

export default ProjectUserList;

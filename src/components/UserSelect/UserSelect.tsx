import React, { FC, useState } from 'react';
import { Button, Chip, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface UserSelectProps {
  fetchEmails: () => void;
  users: string[];
  handleConfirm: (users: string[]) => void;
}

const UserSelect: FC<UserSelectProps> = ({ users, handleConfirm, fetchEmails }: UserSelectProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleDelete = (option: string) => {
    setSelected(selected.filter(selection => selection !== option));
  };

  const handleChoice = (e: any) => {
    // not the best way but seems to be reliable
    const idx = e.target.attributes.getNamedItem('data-option-index').nodeValue;
    setSelected([...selected, users[idx]]);
  };

  const handleConfirmAndClearValues = () => {
    handleConfirm(selected);
    setSelected([]);
  };

  return (
    <>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={users}
        getOptionLabel={(option: string) => option}
        value={selected}
        onChange={e => handleChoice(e)}
        onOpen={fetchEmails}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip label={option} {...getTagProps({ index })} onDelete={() => handleDelete(option)} />
          ))
        }
        noOptionsText="No users"
        renderInput={params => <TextField {...params} variant="outlined" placeholder="Users" fullWidth />}
      />
      {selected.length ? (
        <Button style={{ marginTop: '0.5em' }} onClick={handleConfirmAndClearValues}>
          Add new Users
        </Button>
      ) : null}
    </>
  );
};

export default UserSelect;

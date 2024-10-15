import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { InputLabel, TextField, Chip } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import AddMemberEmail from './AddMemberEmail';

import {getFriendsAction} from '../../action/tempUser';

const CustomLabel = styled(InputLabel)(({ theme }) => ({
  whiteSpace: 'nowrap',
  flexShrink: 0,
}));

const filter = createFilterOptions();

const AddMember = ({ inviteMemberData, handleInviteMemberData, handleDeleteMemberData, userData }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [memberEmailModelVal, setMemberEmailModelVal] = useState({ isOpen: false, memberName: "" });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const friends = await dispatch(getFriendsAction());
        setOptions(friends);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, []);


  useEffect(() => {
    setOpenMenu(!!inputValue);
  }, [inputValue]);

  const handleInputMemberChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleMemberChange = (event, newValue) => {
    const lastItem = newValue[newValue.length - 1];

    if (lastItem && lastItem.inputValue) {
      const newMember = lastItem.inputValue;
      setValue((prev) => [...prev, { username: newMember }]); 
      setInputValue('');
    } else {
      setValue(newValue);
    }
    const findOptions = options.find(val => val.username === typeof lastItem === 'string' ? lastItem : lastItem.username || lastItem.inputValue)
    if(findOptions) {
      handleInviteMemberData({userId: findOptions.friendId, email: findOptions.email, username: findOptions.username});
    } else {
      setMemberEmailModelVal({ isOpen: true, memberName: typeof lastItem === 'string' ? lastItem : lastItem.username || lastItem.inputValue });
    }
  };

  const handleInputDelete = (chipToDelete) => {
    setValue((chips) => chips.filter((chip) => chip !== chipToDelete));
    handleDeleteMemberData(chipToDelete);
  };

  const submitMemberEmailData = (inviteData) => {
    handleInviteMemberData(inviteData);
    setMemberEmailModelVal({ isOpen: false, memberName: '' });
  };

  const cancelMemberEmailModel = () => {
    setMemberEmailModelVal({ isOpen: false, memberName: '' });
  };

  return (
    <>
      <CustomLabel htmlFor="text-field">With <b>you</b> and :</CustomLabel>
      <Autocomplete
        multiple
        fullWidth
        value={value}
        onInputChange={handleInputMemberChange}
        onChange={handleMemberChange}
        open={openMenu}
        onOpen={() => setOpenMenu(true)}
        onClose={() => setOpenMenu(false)}
        options={options}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.username)}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;
          const isExisting = options.some(option => inputValue === option.username);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              username: `Add "${inputValue}"`,
            });
          }
          return filtered;
        }}
        renderOption={(props, option) => (
          <li {...props} key={typeof option === 'string' ? option : option.username}>
            {typeof option === 'string' ? option : option.username}
          </li>
        )}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} variant='standard' />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={index}
              label={typeof option === 'string' ? option : option.username}
              {...getTagProps({ index })}
              onDelete={() => handleInputDelete(option)}
            />
          ))
        }
      />
      <AddMemberEmail
        modelData={memberEmailModelVal}
        submitMemberEmailData={submitMemberEmailData}
        cancelMemberEmailModel={cancelMemberEmailModel}
      />
    </>
  );
};

export default AddMember;
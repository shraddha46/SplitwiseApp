import React, {useState, useEffect} from 'react';
import { InputLabel, TextField} from '@mui/material';
import Autocomplete,{createFilterOptions} from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

import AddMemberEmail from './AddMemberEmail';

const CustomLabel = styled(InputLabel)(({ theme }) => ({
    whiteSpace: 'nowrap',
    flexShrink: 0,
}));

const filter = createFilterOptions();

const AddMember = ({inviteMemberData, handleInviteMemberData}) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState([]);
    const [options] = useState([]);

    const [memberEmailModelVal, setMemberEmailModelVal] = useState({isOpen: false, memberName: ""});

    useEffect(() => {
        if (inputValue) {
          setOpenMenu(true);
        } else {
          setOpenMenu(false);
        }
      }, [inputValue]);
    
      const handleInputMemberChange = (event, newInputValue) => {
        setInputValue(newInputValue);
      };
    
      const handleMemberChange = (event, newValue) => {
        setValue(newValue)
        setMemberEmailModelVal({isOpen: true, memberName: inputValue});
      };

      const submitMemberEmailData = (inviteData) => { 
        handleInviteMemberData(inviteData);
        setMemberEmailModelVal({isOpen: false, memberName: ''});
      }

      const cancelMemberEmailModel = () => {
        setMemberEmailModelVal({isOpen: false, memberName: ''});
        value.pop();
      }
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
                getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(option => inputValue === option.title);
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            inputValue,
                            title: `Add "${inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                renderOption={(props, option) => (
                    <li {...props} key={option.title}>
                        {option.title}
                    </li>
                )}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} variant='standard' />
                )}
            />
            <AddMemberEmail 
                modelData={memberEmailModelVal} 
                submitMemberEmailData={submitMemberEmailData}
                cancelMemberEmailModel={cancelMemberEmailModel}
            />
        </>
    )
}

export default AddMember;
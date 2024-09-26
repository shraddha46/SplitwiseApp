import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, TextField, InputAdornment, Input, FormHelperText, FormControl, Typography, Chip, Popover, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import { styled } from '@mui/material/styles';
import ExpenseNoteImg from '../../Images/expense-note.png';
import { addExpenseAction } from '../../action/expense';
import { addTempUsersAction } from '../../action/tempUser';

import AddMember from '../MemberExpense/AddMember';
import SuccessModal from '../../core/SuccessModal';

const AddExpenseDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.secondary.orange,
  color: 'white',
  padding: theme.spacing(2),
  margin: 0,
  position: 'relative',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
}));

const FieldContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  padding: '12px 0 12px 0'
}));

const CustomChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.secondary.logged,
  border: `2px dashed ${theme.palette.secondary.orange}`,
  fontWeight: 500,
  margin: '0 4px 0 4px',
  padding: '8px 4px',
  cursor: 'pointer'
}));

const OutlineBtn = styled(Button)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: '16px',
  textTransform: 'none',
  color: theme.palette.secondary.orange,
  border: `1px solid ${theme.palette.secondary.orange}`,
  padding: "12px 16px"
}));

const FillBtn = styled(OutlineBtn)(({ theme }) => ({
  marginLeft: 16,
  marginRight: 16,
  backgroundColor: theme.palette.secondary.orange,
  color: '#FFF'
}));

const CustomCheckIcon = styled(CheckIcon)(({ theme }) => ({
  color: theme.palette.secondary.orange,
}));

const CustomListText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.secondary.orange,
}));

const AddExpense = ({ open, closeExpenseModel }) => {

  const [expenseData, setExpenseData] = useState({ description: '', amount: 0.00, createdBy: '', date: new Date() });
  const [expenseMembers, setExpenseMembers] = useState([]);
  const [errors, setErrors] = useState({ description: '', amount: '' });
  const [openSuccessModel, setOpenSuccessModel] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");

  const [inviteMemberData, setInviteMemberData] = useState([]);
  const [anchorMemberEl, setAnchorMemberEl] = useState(null);

  const { userData } = useSelector(state => state.userState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openMemberMenu = Boolean(anchorMemberEl);
  const paidByListId = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setExpenseData({ ...expenseData, createdBy: userData.id });
    setExpenseMembers([...expenseMembers, {userId: userData.id, userName: userData.username, paidBy: 0, owedBy: 0}])
    setSelectedMember(userData.username)
  }, [userData]);

  // useEffect(() => {
  //   setExpenseData({ description: '', amount: 0.00, createdBy: '', date: new Date() });
  //   setExpenseMembers([]);
  // },[open]);

  const openMemberList = (event) => {
    setAnchorMemberEl(event.currentTarget);
  };

  const closeMemberList = () => {
    setAnchorMemberEl(null);
  };

  const handleInviteMemberData = (inviteMembers) => {
    setInviteMemberData([...inviteMemberData, { ...inviteMembers, inviteBy: userData.id }]);
    setExpenseMembers([...expenseMembers.map(val => val.userName === selectedMember ? {...val, owedBy: expenseData.amount / (expenseMembers.length + 1)} : val), {userName: inviteMembers.username, paidBy: 0, owedBy: expenseData.amount / (expenseMembers.length + 1) }])
  };

  const handleAmountChange = (e) => {
    setExpenseData({ ...expenseData, amount: parseFloat(e.target.value).toFixed(2) });
    setExpenseMembers([...expenseMembers.map(val => val.userName === selectedMember ? {...val, paidBy: parseFloat(e.target.value).toFixed(2), owedBy: parseFloat(e.target.value).toFixed(2)/expenseMembers.length } : {...val, paidBy: 0, owedBy: parseFloat(e.target.value).toFixed(2)/expenseMembers.length })]);
  }

  const handleDeleteMemberData = (memberName) => {
    setInviteMemberData([...inviteMemberData.filter(val => val.userName !== memberName)]);
    //])
  }

  const validateExpenseData = () => {
    let isValid = true;
    const newErrors = { description: '', amount: '' };

    if (!expenseData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!(expenseData.amount > 0)) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (newErrors.description || newErrors.amount) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitExpenseData = async () => {
    console.log("expense data",expenseData)
    console.log("temp user", inviteMemberData)
    console.log("member list",expenseMembers)
    // try {
    //   if (validateExpenseData()) {
    //     await dispatch(addExpenseAction(expenseData));
    //     if (inviteMemberData.length > 0) {
    //       await dispatch(addTempUsersAction(inviteMemberData))
    //     }
    //     setOpenSuccessModel(true);
    //   }
    // } catch (error) {

    // }
  }

  const handleCloseSuccessModel = () => {
    setOpenSuccessModel(false);
    closeExpenseModel();
    navigate('/all-expenses');
  };

  return (
    <>
      <Dialog open={open} BackdropProps={{
        style: { backgroundColor: 'rgba(20, 20, 8, 0.8)' }
      }}>
        <AddExpenseDialogTitle sx={{ p: 1, pl: 2 }}>
          Add an expense
          <CloseButton aria-label="close">
            <CloseIcon onClick={closeExpenseModel} />
          </CloseButton>
        </AddExpenseDialogTitle>
        <DialogContent>
          <FieldContainer>
            <AddMember inviteMemberData={inviteMemberData} handleDeleteMemberData={handleDeleteMemberData} handleInviteMemberData={(data) => handleInviteMemberData(data)} />
          </FieldContainer>
          <div>
            <FieldContainer style={{ paddingTop: '0px', marginTop: '8px' }}>
              <img src={ExpenseNoteImg} alt="" />
              <div>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Enter a description"
                  name="description"
                  autoComplete="description"
                  variant='standard'
                  size="small"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                />
                <FormControl variant="standard" fullWidth style={{ marginTop: '14px' }} error={Boolean(errors.amount)}>
                  <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                  <Input
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        step: 1
                      }
                    }}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    name="amount"
                    id="amount"
                    defaultValue={expenseData.value}
                    value={expenseData.amount}
                    onChange={handleAmountChange}
                  />
                  <FormHelperText>{errors.amount}</FormHelperText>
                </FormControl>
              </div>
            </FieldContainer>
            <Typography component="p" style={{ marginTop: '16px' }}>
              Paid by <CustomChip aria-describedby={paidByListId} label="you" size="small" onClick={openMemberList} /> and split <CustomChip label="equally" size="small" />.
            </Typography>
            <Popover
        id={paidByListId}
        open={openMemberMenu}
        anchorEl={anchorMemberEl}
        onClose={closeMemberList}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          {console.log("members",userData)}
          {expenseMembers.map((member,index) => (
            <ListItem button key={index} sx={{pt:0.8, pb:0.8}} onClick={closeMemberList} secondaryAction={
selectedMember === member.userName ? <CustomCheckIcon /> : <></>
            }>
              <ListItemAvatar sx={{minWidth: '48px'}}>
                <Avatar sx={{width: '32px', height: '32px', fontSize: '16px', p: 0.2}}>{member.userName[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.userName} sx={{pr:1.5}} />
            </ListItem>
          ))}
          <ListItem button sx={{pt:0.8, pb:0.8}} onClick={closeMemberList} >
              <ListItemAvatar sx={{minWidth: '48px'}}>
                <Avatar sx={{width: '32px', height: '32px', fontSize: '16px', p: 0.2}}><PeopleIcon /></Avatar>
              </ListItemAvatar>
              <CustomListText primary={"Mulltiple Members"} sx={{pr:1.5}} />
            </ListItem>
        </List>
      </Popover>
            <Typography component="p" style={{ marginTop: '8px', fontSize: '14px' }}>
              ($1000.00/person)
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '18px' }} >
                <DateTimePicker
                  label="Data & Time"
                  name="date"
                  defaultValue={expenseData.date}
                  onChange={(newValue) => setExpenseData({ ...expenseData, date: newValue })}
                  slotProps={{
                    textField: {
                      variant: 'standard',
                    }
                  }}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              </div>
            </LocalizationProvider>

          </div>
        </DialogContent>
        <DialogActions sx={{ mb: '4px' }}>
          <OutlineBtn onClick={closeExpenseModel}>
            Cancel
          </OutlineBtn>
          <FillBtn variant="contained" onClick={submitExpenseData}>
            Save
          </FillBtn>
        </DialogActions>
      </Dialog>
      <SuccessModal open={openSuccessModel} handleClose={handleCloseSuccessModel} title="Expense Added Successfully!" />
    </>
  )
}

export default AddExpense;
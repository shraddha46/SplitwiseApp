import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputLabel, TextField, InputAdornment, Input, FormHelperText, FormControl, Typography, Chip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
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

const AddExpense = ({ open, closeExpenseModel }) => {

  const [expenseDetail, setExpenseDetail] = useState({ description: '', amount: 0.00, paidBy: '', date: new Date() });
  const [errors, setErrors] = useState({ description: '', amount: '' });
  const [openSuccessModel, setOpenSuccessModel] = useState(false);

  const [inviteMemberData, setInviteMemberData] = useState([]);

  const { userData } = useSelector(state => state.userState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setExpenseDetail({ ...expenseDetail, paidBy: userData.id });
  }, [userData]);

  const handleInviteMemberData = (inviteMembers) => {
    setInviteMemberData([...inviteMemberData, { ...inviteMembers, inviteBy: userData.id }]);
  };

  const validateExpenseData = () => {
    let isValid = true;
    const newErrors = { description: '', amount: '' };

    if (!expenseDetail.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!(expenseDetail.amount > 0)) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (newErrors.description || newErrors.amount) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitExpenseData = async () => {
    try {
      if (validateExpenseData()) {
        await dispatch(addExpenseAction(expenseDetail));
        if (inviteMemberData.length > 0) {
          await dispatch(addTempUsersAction(inviteMemberData))
        }
        setOpenSuccessModel(true);
      }
    } catch (error) {

    }
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
            <AddMember inviteMemberData={inviteMemberData} handleInviteMemberData={(data) => handleInviteMemberData(data)} />
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
                  value={expenseDetail.description}
                  onChange={(e) => setExpenseDetail({ ...expenseDetail, description: e.target.value })}
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
                    defaultValue={expenseDetail.value}
                    value={expenseDetail.amount}
                    onChange={(e) => setExpenseDetail({ ...expenseDetail, amount: e.target.value })}
                  />
                  <FormHelperText>{errors.amount}</FormHelperText>
                </FormControl>
              </div>
            </FieldContainer>
            <Typography component="p" style={{ marginTop: '16px' }}>
              Paid by <CustomChip label="you" size="small" /> and split <CustomChip label="equally" size="small" />.
            </Typography>
            <Typography component="p" style={{ marginTop: '8px', fontSize: '14px' }}>
              ($1000.00/person)
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '18px' }} >
                <DateTimePicker
                  label="Data & Time"
                  name="date"
                  defaultValue={expenseDetail.date}
                  onChange={(newValue) => setExpenseDetail({ ...expenseDetail, date: newValue })}
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
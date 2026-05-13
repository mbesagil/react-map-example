import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Typography,
  Box
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from 'react-i18next';

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText,
  severity = 'error' 
}) => {
  const { t } = useTranslation();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, width: '100%', maxWidth: 400 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <DeleteForeverIcon color={severity} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title || t('confirm_action')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit" variant="text" sx={{ fontWeight: 'bold' }}>
          {cancelText || t('cancel')}
        </Button>
        <Button 
          onClick={() => { onConfirm(); onClose(); }} 
          color={severity} 
          variant="contained" 
          autoFocus
          sx={{ fontWeight: 'bold', borderRadius: 2 }}
        >
          {confirmText || t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

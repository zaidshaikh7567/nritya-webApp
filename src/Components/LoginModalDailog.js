import React from "react";
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import LoginModalForm from "./LoginModalForm";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, Theme} from "@material-ui/core";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    }
  }));

  const useStyles = makeStyles((theme: Theme) => ({
    backDrop: {
      backdropFilter: "blur(3px)",
      backgroundColor:'rgba(0,0,30,0.4)'
    },
  }));


const LoginModalDailog = ({open, handleClose }) => {
  const classes = useStyles();
    return (

        <React.Fragment>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth='xs'
            BackdropProps={{
              classes: {
                root: classes.backDrop,
              },
            }}
          >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
           <CloseIcon />
        </IconButton>
            <LoginModalForm/>
          </BootstrapDialog>
        </React.Fragment>
       
    )
}

export default LoginModalDailog;
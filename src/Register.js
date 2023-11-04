import React from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import axios from "axios";
import { useCookies } from 'react-cookie'

import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import MuiAlert from '@mui/material/Alert';




function Register() {
    const navigate = useNavigate();
    let [cookies, setCookie] = useCookies(['token'])


    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
        if ("clickaway" == reason) return;
        setOpen(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const SnackbarEvent = (severity, text) => {
        setOpen(true);
        setSnackbarData({ severity, text });
    };

    const [snackbarData, setSnackbarData] = React.useState({
        severity: 'success',
        text: 'This is a success message!',
    });

    const handleSignUp = (id, password) => {
        // Do something with id and password, e.g., send a request to the server
        console.log("Received id and password:", id, password);

        if(id.length!=13){
            SnackbarEvent('error', '13 digit id');
            return 
        }

        axios.post(
            'http://localhost:5101/Users',
            { id: id, password: password },
            { headers: { /* Authorization: 'Bearer ' + token */ }, timeout: 10 * 1000 }
        ).then((response) => {
            console.log("status code:" + response.status);
            console.log("cookies:" + response.data.token);
            setCookie('token', response.data.token);
            if (response.status === 200) {
                SnackbarEvent('success', 'Register success');
                setTimeout(() => {
                    navigate('/login');
                }, 1000); // Delay the navigation by 1 second (adjust as needed)
            }
        }).catch((error) => {
            if (error.code === 'ECONNABORTED') {
                console.log('timeout');
            } else {
                console.log(error.response.status + ' ' + error.response.statusText);
                SnackbarEvent('error', 'An error occurred while signup.');
            }
        });
    }


    return (
        <div>
            <SignUp onSignUp={handleSignUp} />

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarData.severity} sx={{ width: '100%' }}>
                    {snackbarData.text}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default Register;

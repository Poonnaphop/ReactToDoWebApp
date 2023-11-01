import React from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import axios from "axios";
import { useCookies } from 'react-cookie'


function Login() {
    const navigate = useNavigate();
    let [cookies, setCookie] = useCookies(['token'])
    const handleSignIn = (id, password) => {
        // Do something with id and password, e.g., send a request to the server
        console.log("Received id and password:", id, password);

        //navigate("/main");

        axios.post(
            'http://localhost:5101/tokens',
            { id: id, password: password },
            { headers: { /* Authorization: 'Bearer ' + token */ }, timeout: 10 * 1000 }
        ).then((response) => {
            console.log("status code:"+response.status)
            console.log("cookies:" + response.data.token)
            setCookie('token', response.data.token)
            if (response.status == 200) {
                navigate('/main')
            }

        }).catch((error) => {
            if (error.code === 'ECONNABORTED') {
                console.log('timeout')
            } else {
                console.log(error.response.status + ' ' + error.response.statusText)
                alert("alert")
            }

        })
    }

    return (
        <div>
            <SignIn onSignIn={handleSignIn} />
        </div>
    );
}

export default Login;

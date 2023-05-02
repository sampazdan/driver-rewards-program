import "./Landing.css"
import React, {useState} from "react"
import axios from 'axios'
import Cookies from 'js-cookie'
import * as authtools from '../../authtools'
import Login from "../../components/Login/Login";
import {
    Divider
} from "@chakra-ui/react";
import {BrowserRouter, Route} from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

const requestConfig = {
    headers: {
        'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf'
    }
}

const baseUrl = 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/'

const Landing = ({authState, changeAuthState}) => {
    const [isLogin, setIsLogin] = useState(true)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')
    const [isAuthing, setAuthing] = useState('true')

    if (Cookies.get('TruckSession') && Cookies.get('TruckUser')) {
        console.log("checking auth state...")

        const requestBody = {
            user: {
                username: Cookies.get('TruckUser')
            },
            token: Cookies.get('TruckSession')
        }

        axios.post(baseUrl + 'verify', requestBody, requestConfig).then((response) => {
            console.log(response)
            changeAuthState(true)

        }).catch((error) => {
            console.log(error.response.data.message)
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isLogin) {
            const requestBody = {
                username: username,
                password: password
            }

            axios.post(baseUrl + 'login', requestBody, requestConfig).then((response) => {
                Cookies.set('TruckSession', response.data.token)
                Cookies.set('TruckUser', response.data.user.username)

                console.log("COOKIE = " + Cookies.get('TruckSession'))

                console.log(response)
                changeAuthState(true)
            }).catch((error) => {
                if (error.response.status === 401 || error.response.status === 403) {
                    setError(error.response.data.message)
                } else {
                    setError("Server error. Try again later.")
                }
            })
        } else {
            const requestBody = {
                username: username,
                password: password,
                email: email,
                name: name
            }

            axios.post(baseUrl + 'register', requestBody, requestConfig).then((response) => {
                console.log(response)
                setError("Account created. Please log in.")

                setName('')
                setEmail('')
                setPassword('')
                setUsername('')

                setIsLogin(true)

            }).catch((error) => {
                setError(error.response.data.message)
            })

        }

        console.log("name = " + name + " email = " + email + " username = " + username + " password = " + password)
    }


    return (


        <div className="landing-container">
            <header className="landing-header">
                <h5>
                    CabCaddy
                </h5>
            </header>

            <Divider colorScheme="gray"/>


            <BrowserRouter>
                <Login/>
                {/*<Route exact path="/" component={Login}/>*/}
            </BrowserRouter>
            {/*<button className="logregbutton" onClick={() => setIsLogin(true)}>Login</button>*/}
            {/*<button className="logregbutton" onClick={() => setIsLogin(false)}>Register</button>*/}
            {/*{renderForm}*/}
            {/*{error}*/}

        </div>
    )
}

export default Landing
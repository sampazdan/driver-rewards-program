import {
    Box,
    Button,
    Checkbox,
    Select,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    SelectField,
    Center,
    Progress,
} from '@chakra-ui/react'
import { PasswordField } from './PassField'
import {useEffect, useState} from "react";
import { AnimateSharedLayout, motion } from "framer-motion";
import { BiArrowBack } from 'react-icons/bi'
import { BsCheckCircle } from 'react-icons/bs'
import Loading from '../Loading/loading'
import authtools from '../../authtools'
import axios from 'axios'

const requestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf'
    }
}

const baseUrl = 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/'

export const Login = () => {

    const [loading, setLoading] = useState(false)

    const [sponsors, setSponsors] = useState([])

    const [login, setLogin] = useState({
        username: '',
        password: ''
    })

    const [apply, setApply] = useState({
        sponsor: '',
        name: '',
        username: '',
        email: '',
        password: '',
        confirm: '',
        dob: '',
        dlNum: 0
    })

    const [reset, setReset] = useState('')

    const [error, setError] = useState('')

    const [func, setFunc] = useState('login')

    // side effect to handle loading of sponsors for apply page
    useEffect(() => {
        if(func === "login" || func === "reset"){
            setLoading(false)
        } else {
            try {
                setLoading(true)
                axios.get(baseUrl + '/sponsor?sponsorId=', requestConfig).then((response) => {
                    console.log("AT GETDATA = " + JSON.stringify(response.data))
                    setLoading(false)
                    setSponsors((response.data))
                })
            } catch (error) {
                setLoading(false);
                authtools.handleError(error)
                console.log(error);
            }
        }
    }, [func]);

    useEffect(() => {
        if(func==="login"){
            console.log(authtools.getCookies())
            setLoading(true)
            authtools.verify().then((response) => {
                setLoading(false)
                window.location.href = "/dashboard"
            }, error => {
                setLoading(false)
            })
        }
    }, [])

    // state that holds strength state and message for password validation
    const [passStatus, setPassStatus] = useState({
        progress: 0,
        message: ''
    })

    //state that holds match status and message of confirm password field
    const [confStatus, setConfStatus] = useState({
        text: "",
        match: false
    })

    //checks password strength and sets message
    const checkPassword = (pass) => {
        const strengthChecks = {
            length: 0,
            hasUpperCase: false,
            hasLowerCase: false,
            hasDigit: false,
            hasSpecialChar: false,
        };

        strengthChecks.length = pass.length >= 8;
        strengthChecks.hasUpperCase = /[A-Z]+/.test(pass);
        strengthChecks.hasLowerCase = /[a-z]+/.test(pass);
        strengthChecks.hasDigit = /[0-9]+/.test(pass);
        strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(pass);

        let verifiedList = Object.values(strengthChecks).filter((value) => value);

        let progress = (verifiedList.length/5) * 100
        let message = progress === 100 ? "Looks good!" : "Password requires an uppercase letter, lowercase letter, " +
            "digit (0-9), special character"

        setPassStatus({
            progress: progress,
            message: message
        })
    }

    //checks validity of confirm password field
    const checkConfirm = (conf, pass) => {
        let cError = conf === pass ? "Looks good!" : "Passwords must match"
        let cMatch = conf === pass
        setConfStatus({
            text: cError,
            match: cMatch
        })
    }

    let form = <></>
    let navButton = <></>
    let submitButton = <></>

    let headerText = func === 'login' ? "Log in" : (func === 'apply') ? "Apply to be a Driver" : (func === 'reset') ? "Reset Password" : ""

    const sponsorList = () => {
        let list = []
        sponsors.forEach(s => {
            list.push(<option value={s.sponsorId}>{s.sponsorName}</option>)
        })
        return list
    }

    //DRIVER APPLY
    if(func === 'apply'){
        submitButton = (
            <Button onClick={(event => {
                setLoading(true)
                const reqBody = {
                    "name" : apply.name,
                    "username" : apply.username,
                    "email" : apply.email,
                    "password" : apply.password,
                    "dob" : apply.dob,
                    // "sponsorIds": [apply.sponsor],
                    "dlNum": apply.dlNum,
                    // "applications": [
                    //     {
                    //         "sponsorId": apply.sponsor,
                    //         "message": apply.comment
                    //     }
                    // ]
                    "appliedTo": apply.sponsor,
                    "applyComment": apply.comment
                }

                axios.post(baseUrl + 'register', reqBody, requestConfig).then((response)=> {
                    setLoading(false)
                    setFunc('applied')
                }, error => {
                    authtools.handleError(error)
                    //console.log(error.response.data.message)
                })
            })}>Submit Application</Button>
        )

        navButton = (
            <HStack justify="space-between">

                <Button variant="link" colorScheme="blue" onClick={(event) => {
                    setFunc('login')
                }}>
                    <BiArrowBack/>
                    &nbsp;Back to Login
                </Button>
            </HStack>
        )

        form = (
            <>
                <FormControl>
                    <FormLabel htmlFor="email">Sponsor Company</FormLabel>
                    <SelectField placeholder="Select a company" onChange={(event) => {
                        setApply(prevState => ({
                            ...prevState,
                            sponsor: event.target.value
                        }))
                        console.log(apply)
                    }}>
                        {sponsorList()}
                    </SelectField>

                    <Stack spacing="5">
                        <br/>
                        <Divider/>

                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input id="name" type="text" value = {apply.name} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                name: event.target.value
                            }))
                        }}/>

                        <FormLabel htmlFor="apply-username">Username</FormLabel>
                        <Input id="apply-username" type="text" value={apply.username} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                username: event.target.value
                            }))
                        }}/>

                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input id="apply-email" type="email" value={apply.email} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                email: event.target.value
                            }))
                            console.log(apply)
                        }}/>

                        <Divider/>

                        <FormLabel htmlFor="appy-password">Password</FormLabel>
                        <PasswordField id="apply-password"
                            onChange={(event) => {
                                setApply(prevState => ({
                                    ...prevState,
                                    password: event.target.value
                                }))
                                checkPassword(event.target.value)
                            }}
                        />
                        <Progress colorScheme= {passStatus.progress <= 40 ? 'red' : passStatus.progress <= 80 ? 'yellow' : 'green'} value={passStatus.progress}/>
                        <Text>{passStatus.message}</Text>

                        <FormLabel htmlFor="apply-confirm">Confirm password</FormLabel>
                        <PasswordField id="apply-confirm" value = {apply.confirm} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                confirm: event.target.value
                            }))
                            checkConfirm(event.target.value, apply.password)
                        }}/>
                        <Text color = {confStatus.match ? 'green' : 'red'}>{confStatus.text}</Text>

                        <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                        <Input id="apply-dob" type="date" value={apply.dob} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                dob: event.target.value
                            }))
                        }}/>

                        <FormLabel htmlFor="apply-dl">Drivers License #</FormLabel>
                        <Input id="apply-dl" type="text" value={apply.dlNum} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                dlNum: event.target.value
                            }))
                        }}/>

                        <FormLabel htmlFor="apply-comment">Application Comment</FormLabel>
                        <Input id="apply-dl" type="text" value={apply.comment} onChange={(event) => {
                            setApply(prevState => ({
                                ...prevState,
                                comment: event.target.value
                            }))
                        }}/>

                    </Stack>
                </FormControl>
            </>
        )

        // submitButton = (
        //     <Button onClick={() => {
        //         setFunc("applied")
        //     }}>Submit Application</Button>
        // )

        //PASSWORD RESET
    } else if (func === 'reset'){

        submitButton = (
            //TODO : CALL PASSWORD RESET
            <Button>Reset Password</Button>
        )

        form = (
            <>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="reset-email" type="email"  onChange={(event) => {
                        console.log(event.target.value)
                    }}/>
                </FormControl>
            </>
        )

        navButton = (
            <HStack justify="space-between">

                <Button variant="link" colorScheme="blue" onClick={(event) => {
                    setFunc('login')
                }}>
                    <BiArrowBack/>
                    &nbsp;Back to Login
                </Button>
            </HStack>
        )

        // LOGIN
    } else if(func === 'login') {

        submitButton = (
            <Button onClick = {() => {
                authtools.authenticate(login.username, login.password)
            }}>Sign in</Button>
        )

        navButton = (
            <HStack justify="space-between">
                <Text color="muted">Want to apply as a driver?</Text>
                <Button variant="link" colorScheme="blue" onClick={(event) => {
                    setFunc('apply')
                }}>
                    Apply here
                </Button>
            </HStack>
        )

        form = (
            <>
                <Stack spacing="5">
                    <FormControl>

                        <FormLabel htmlFor="login-username">Username</FormLabel>
                        <Input id="login-username" type="text" value = {login.username} onChange={(event) => {
                            // setUsername(event.target.value)
                            //console.log("state = " + username)

                            setLogin((prevState => ({
                                ...prevState,
                                username: event.target.value
                            })))
                        }}/>

                        <FormLabel htmlFor="email">Password</FormLabel>
                        <PasswordField
                            onChange={(event) => {
                                setLogin(prevState => ({
                                    ...prevState,
                                    password: event.target.value
                                }))
                            }}
                        />

                    </FormControl>
                </Stack>
                <HStack justify="space-between">
                    <Button variant="link" colorScheme="blue" size="sm" onClick={() => {
                        setFunc('reset')
                    }}>
                        Forgot password?
                    </Button>
                </HStack>
            </>
        )
    } else if(func === 'applied') {
        form = (
            <>
                <Text fontSize='2xl' align="center">Application Submitted</Text>
                <Center>
                    <BsCheckCircle size="100" color="green"/>
                </Center>
                <Text align="center">
                    We'll email you when you're accepted.
                </Text>
            </>
        )
    }

    if(loading){
        return (
            <Container maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
                <Loading/>
            </Container>
        )
    }

    return (
        <AnimateSharedLayout>
            <Container maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
                <Stack spacing="8">
                    <Stack spacing="6">
                        <Stack spacing={{base: '4', md: '3'}} textAlign="center">
                            <Heading size={{base: 'sm', md: 'md'}}>{headerText}</Heading>
                            <HStack spacing="1" justify="center">
                            </HStack>
                        </Stack>
                    </Stack>
                    <Box
                        py={{base: '0', sm: '8'}}
                        px={{base: '4', sm: '10'}}
                        bg={{base: 'transparent', sm: 'bg-surface'}}
                        boxShadow={{base: 'none', sm: 'md'}}
                        borderRadius={{base: 'none', sm: 'xl'}}
                        backgroundColor="white"
                    >
                        <Stack spacing="6">
                            {form}
                            <Stack spacing="6">
                                {submitButton}
                                <Divider/>
                                {navButton}
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </AnimateSharedLayout>
    )
}

export default Login
import axios from 'axios'
import Cookies from "js-cookie";
import Swal from 'sweetalert2'

const requestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf'
    }
}

const baseUrl = 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/'

export const logout = () => {
    Cookies.set('TruckSession', '')
    Cookies.set('TruckUser', '')
    window.location.href = '/'
}

const handleResponse = (response) => {
    return response
}

export const handleError = (error) => {

    //need 401 too?
    if(error.response.status === 403){
        window.location.href = "/"
        logout()
        console.log("403 error...")
        console.log("error = " + error)
        alert(error.response.data.message)
        return "invalid session"
    } else {
        console.log("uhhh")
        console.log("error status = " + JSON.stringify(error.response.status))
        console.log("error = " + JSON.stringify(error.response.data.message))
        return error.response.message
    }
}

export const authenticate = (username, password) => {
    const reqBody = {
        username: username,
        password: password,
    }

    console.log("username = " + username + " password = " + password)

    axios.post(baseUrl + 'login', reqBody, requestConfig).then((response) => {
        Cookies.set('TruckSession', response.data.token)
        Cookies.set('TruckUser', response.data.user.username)
        Cookies.set('TruckSponsor', response.data.user.sponsor)
        var accType = ''
        console.log("ACCOUNT TYPE = " + response.data.user.accountType)
        if(response.data.user.accountType === 3){
            accType = 'admin'
        } else if (response.data.user.accountType === 2){
            accType = 'sponsor'
        } else {
            accType = 'driver'
        }
        Cookies.set('TruckAccountType', accType)
        //Cookies.set('TruckUser', response.data.user.sponsorId)
        handleResponse()
        window.location.href = "/dashboard"
        //console.log(response.data)
    }).catch((error) => {
        handleError(error)
        //console.log("MESSAGE = " + error.message)
        return error.response.data.message
    })
}

export const callApi = (method, path, request) => {
    if (method === 'POST'){
        axios.post(baseUrl + path, request, requestConfig).then((response) => {
            return handleResponse(response)
        }).catch((error) => {
            return handleError(error)
        })
    } else if (method === 'GET'){
        axios.get(baseUrl + path, requestConfig, request).then((response) => {
            return handleResponse(response)
        }).catch((error) => {
            return handleError(error)
        })
    }
    return null
}

//TODO: ADD TOKEN VERIFICATION
export const getUser = async () => {

    var data = JSON.stringify({
        "username": Cookies.get("TruckUser"),
        "token": Cookies.get('TruckSession')
    });

    console.log("SESSION = " + Cookies.get('TruckSession'))

    const params = new URLSearchParams([['userId', Cookies.get("TruckUser")], ['token', Cookies.get('TruckSession')], ['url', 'true']]);

    var config = {
        method: 'get',
        url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/user',
        headers: {
            'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader()
        },
        data : data,
        params : params
    };

    //returns a Promise to return the user data
    return axios(config)
}


export const verify = () => {

    const username = Cookies.get('TruckUser')
    const token = Cookies.get('TruckSession')

    console.log("USERNAME = " + username + " TOKEN = " + token)

    const requestBody = {
        user: {
            username: username
        },
        token: token
    }

    return axios.post(baseUrl + 'verify', requestBody, requestConfig)

}

export const getAuthHeader = () => {
    const retVal = `${Cookies.get('TruckUser')}:${Cookies.get('TruckSession')}`
    return retVal
}

export const getCookies = () => {
    return {
        "session" : Cookies.get('TruckSession'),
        "username" : Cookies.get('TruckUser')
    }
}

export default { getCookies, verify, callApi, authenticate, getUser, handleError, logout, getAuthHeader}
import './Users.css'

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Text,
    Button,
    Progress,
    Image,
    Divider,
    Stack,
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Flex,
    Grid,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    SelectField,
    Center,
    // createColumnHelper
} from '@chakra-ui/react'

import React, {useEffect, useState} from 'react'
import authtools from "../../authtools";
import axios from 'axios'
import Loading from "../../components/Loading/loading";
import Cookies from "js-cookie";
import utils from "../../utils"

//0 = asc, 1 = desc
let isDesc = 0;
//0 = Name, 1 = Deadline, 2 = Points
let wSort = 0;

const Users = () => {

    const[table, setTable] = useState([]);
    const [userList, setUserList] = useState({})
    const [loading, setLoading] = useState(true)

    const [pointChange, setPointChange] = useState({})

    let sParam = Cookies.get("TruckSponsor")
    if (sParam === []) {
        sParam = ''
    }

    const accountType = Cookies.get("TruckAccountType")
    
    //API call
    let params = new URLSearchParams([['sponsorId', sParam]]);

    // if(accountType === 'admin'){
    //     params = new URLSearchParams([]);
    // }

        var config = {
            method: 'get',
            url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/users',
            headers: {
                'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                'Content-Type': 'application/json',
                'Authorization': Cookies.get("TruckUser") + ":" + Cookies.get("TruckSession")
            },
            params : params
        };
    useEffect(() => {
        try {
            setLoading(true)
            axios(config).then((response) => {
                console.log(JSON.stringify(response.data))
                setLoading(false)
                setUserList(response.data)
            })
        } catch {
            console.log("error")
            setLoading(false)
        } 
    },[])

    if(loading){
        return (
            <Loading/>
        )
    }
    
    //function to display all users in table and allow admin to change point value
    const displayUsers =()=> {
        let uList = []
        let uType
        userList.forEach(a => {
            if (a.accountType === 0) {
                uType = 'driver (pending)'
            } else if (a.accountType === 1) {
                uType = 'driver'
            } else if (a.accountType === 2) {
                uType = 'sponsor user'
            } else { 
                uType = 'admin'
            }
            uList.push(
                <>
                    <Tr>
                        <Td>{a.username}</Td>
                        <Td>{a.email}</Td>
                        <Td>{a.sponsorIds.join(', ')}</Td>
                        <Td>{uType}</Td>
                        <Td>{a.points}</Td>
                        <Td>
                            <FormControl>
                                <Input 
                                id="points" 
                                type="number"
                                width='80px'
                                onChange={(event) => {
                                    handleChange(event, a.username)
                                }}/>
                            </FormControl>
                        </Td>
                        <Td>
                            <Button onClick={()=>{
                                let change = pointChange.changeVal
                                let usr = pointChange.userId
                                const params = new URLSearchParams([["userId", usr]]) 
                                var ptsconfig = {
                                    method: 'patch',
                                    url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/user?userId=' + usr,
                                    headers: {
                                        'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                                        'Content-Type': 'application/json',
                                        'Authorization': Cookies.get("TruckUser") + ":" + Cookies.get("TruckSession")
                                    },
                                    params: params,
                                    data: {"points":"+" + change},
                                };
                                try {
                                    setLoading(true)
                                    axios(ptsconfig).then((response) => {
                                        console.log(JSON.stringify(response.data))
                                        a.points = response.data.user.points
                                        setLoading(false)
                                    })
                                } catch {
                                    console.log("error")
                                    setLoading(false)
                                }
                            }}
                            >Add</Button>
                        </Td>
                    </Tr>
                </>
            )
        })
        return uList
    }

    const handleChange = (event, usr) => {
        setPointChange({
            "changeVal":event.target.value,
            "userId":usr
        })
    }

    //sorting function
    const whichSort = () => {
        if (wSort===0) {        //sorting by username
            if (isDesc===0) userList.sort((a, b) => a.username.localeCompare(b.username))
            else userList.sort((a, b) => b.username.localeCompare(a.username))
        }
        else if (wSort===1) {   //sorting by sponsor
            if (isDesc===0) userList.sort((a, b) => a.sponsorIds.toString().localeCompare(b.sponsorIds.toString()))
            else userList.sort((a, b) => b.sponsorIds.toString().localeCompare(a.sponsorIds.toString()))
        }
        else if (wSort===2) {   //sorting by account type
            if (isDesc===0) userList.sort((a, b) => {return b.accountType - a.accountType})
            else userList.sort((a, b) => {return a.accountType - b.accountType})
        }
        else if (wSort===3) {   //sorting by points
            if (isDesc===0) userList.sort((a, b) => {return a.points - b.points})
            else userList.sort((a, b) => {return b.points - a.points})
        }
        setTable([...table, userList]);
        return 0;
    }

    return (
        <>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Users</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Username</Th>
                            <Th>Email</Th>
                            <Th>Sponsor</Th>
                            <Th>Account Type</Th>
                            <Th>Points</Th>
                            <Th>Change points</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {displayUsers(userList)}
                    </Tbody>
                    <Tfoot><Tr><Td>
                    <div className="sort-options">
                        <Menu closeOnSelect={false}>
                            <MenuButton id = "sort-button" as={Button} colorScheme='blue' alignContent="right">
                                Sort
                            </MenuButton>
                            <MenuList>
                                <MenuGroup title='Sort by:'>
                                    <MenuItem as='button' onClick={() => {
                                        isDesc = 0;
                                        whichSort();
                                    }}>Ascending</MenuItem>
                                    <MenuItem as='button' onClick={() => {
                                        isDesc = 1;
                                        whichSort();
                                    }}>Descending</MenuItem>
                                </MenuGroup>
                                    <MenuDivider />
                                <MenuGroup>
                                    <MenuItem as='button' onClick={() => {
                                        wSort = 0;
                                        whichSort();
                                    }}>Username</MenuItem>
                                    <MenuItem as='button' onClick={() => {
                                        wSort = 1;
                                        whichSort();
                                    }}>Sponsor</MenuItem>
                                    <MenuItem as='button' onClick={() => {
                                        wSort = 2;
                                        whichSort();
                                    }}>Account Type</MenuItem>
                                    <MenuItem as='button' onClick={() => {
                                        wSort = 3;
                                        whichSort();
                                    }}>Points</MenuItem>
                                </MenuGroup>
                            </MenuList>
                        </Menu>
                    </div></Td></Tr></Tfoot>
                </Table>
            </TableContainer>
        </>
    )
}

export default Users
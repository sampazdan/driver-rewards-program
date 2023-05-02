import React, {useEffect, useState} from 'react'
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom"
import Dashboard from "../../.././src/pages/Dashboard/Dashboard"

import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading, MenuButton, Button, MenuList, MenuGroup, MenuItem, Menu, Center, Link
} from '@chakra-ui/react'
import {
    FiMenu,
    FiHome,
    FiMail,
    FiUser,
    FiSettings
} from 'react-icons/fi'
import { IoPawOutline } from 'react-icons/io5'
import NavItem from '../NavItem'
import MenuBar from '../MenuBar/MenuBar'
import authtools from "../../authtools";
import Cookies from "js-cookie";

const mySponsor = Cookies.get('TruckSponsor')
const accountType = Cookies.get('TruckAccountType')

export default function Sidebar() {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try{
            setLoading(true)
            authtools.getUser().then((response) => {
                setUser(response.data.user)
                console.log("user at sidebar = " + JSON.stringify(response.data.user))
                setLoading(false)
            })
        }
        catch(error){
            setLoading(false);
            authtools.handleError(error)
            console.log(error);
        }
    }, [])

    const [navSize, changeNavSize] = useState("large")

    if(loading){
        return <></>
    }

    return (
        <Flex
            pos="absolute"
            left="5"
            h="95vh"
            marginTop="2.5vh"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            borderRadius={navSize == "small" ? "15px" : "30px"}
            w={navSize == "small" ? "85px" : "200px"}
            flexDir="column"
            justifyContent="space-between"
        >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                as="nav"
            >
                <IconButton
                    // background="none"
                    mt={5}
                    // _hover={{ background: 'none' }}
                    icon={<FiMenu />}
                    onClick={() => {
                        if (navSize == "small")
                            changeNavSize("large")
                        else
                            changeNavSize("small")
                    }}
                />
                <button onClick={() => window.location.href = '/dashboard'}>
                    <NavItem navSize={navSize} icon={FiHome} title="Dashboard"/>
                </button>
                
                 <button onClick={() => window.location.href = '/activities'}>
                    <NavItem navSize={navSize} icon={FiMenu} title="Activities"/>
                </button>
                
                <button onClick={() => window.location.href = '/catalog'}>
                    <NavItem navSize={navSize} icon={FiMenu} title="Catalog"/>
                </button>

                <button onClick={() => window.location.href = '/groups'}>
                <NavItem navSize={navSize} icon={FiUser} title="Groups" />
                </button>
                
                <button onClick={() => window.location.href = '/mail'}>
                <NavItem navSize={navSize} icon={FiMail} title="Mail" />
                </button>
            </Flex>

            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                mb={4}
            >
                <Divider display={navSize == "small" ? "none" : "flex"} />

                {accountType === 'sponsor' || accountType === 'admin' ? (
                    <Center>
                        {/*<Button href = '/sponsor' marginTop = '10px' as='Link' to='/sponsor'>{mySponsor}</Button>*/}
                        <Button>
                            <Link href= '/sponsor' to='/sponsor'>{mySponsor}</Link>
                        </Button>
                    </Center>
                ) : (
                    <Center>
                        <Text fontSize='xl' color='green'>Points: {user.points}</Text>
                    </Center>
                )}

                <Flex mt={4} align="center">
                    <Avatar size="sm" src={user.image} />
                    <Flex flexDir="column" ml={4} display={navSize == "small" ? "none" : "flex"}>
                        <Menu>
                        <MenuButton id = "profile-button" href='/profile' as={Button} colorScheme='blue' alignContent="right">
                            Profile
                        </MenuButton>
                        <MenuList>
                            <MenuGroup title='Account'>
                                <MenuItem as='button' onClick={() => {
                                    window.location.href = "/profile"
                                }} href="/profile">Profile</MenuItem>
                                <MenuItem as='button' onClick = {() => {
                                    authtools.logout()
                                }}>Logout</MenuItem>
                            </MenuGroup>

                        </MenuList>
                            </Menu>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
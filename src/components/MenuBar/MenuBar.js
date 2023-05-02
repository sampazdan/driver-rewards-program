import './MenuBar.css'
import React, {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    Flex,
    Grid
} from '@chakra-ui/react'

import authtools from '../../authtools'

const testFunc = () => {
    console.log("Got menu click")
}

const view = Cookies.get('TruckAccountType')

const MenuBar = () => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try{
            setLoading(true)
            authtools.getUser().then((response) => {
                setUser(response.data.user)
                setLoading(false)
            })
        }
        catch(error){
            setLoading(false);
            authtools.handleError(error)
            console.log(error);
        }
    }, [])

    return (
        <div className="bar-items">
            <div className="menu-items">
                <Menu>
                    {view === 'sponsor' ? (
                        <MenuButton id = "applications-button" as={Button} colorScheme='blue' alignContent="right">
                            Sponsor
                        </MenuButton>
                    ) : ''}
                    <MenuButton id = "profile-button" as={Button} colorScheme='blue' alignContent="right">
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
            </div>
            {/* <h3 className="sponsor-header">ABC Trucking Co</h3> */}
        </div>
    )
}

export default MenuBar
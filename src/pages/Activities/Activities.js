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
    Grid
    // createColumnHelper
} from '@chakra-ui/react'

import {useEffect, useState} from "react";
import axios from 'axios'
import Loading from "../../components/Loading/loading";
import Cookies from "js-cookie";

//0 = asc, 1 = desc
let isDesc = 0;
//0 = Name, 1 = Deadline, 2 = Points
let wSort = 0;

//function to display all activities in table
const displayActivities = (list) => {
    let aList = []
    list.forEach(a => {
        aList.push(
            <>
                <Tr>
                    <Td>{a.name}</Td>
                    <Td>{a.description}</Td>
                    <Td>{a.deadline}</Td>
                    <Td>{a.maxPts}</Td>
                </Tr>
            </>
        )
    })
    return aList
}

const Activities = () => {

    const[table, setTable] = useState([]);
    const [activities, setActivities] = useState({})
    const [loading, setLoading] = useState(true)

    let sParam = Cookies.get("TruckSponsor")
    if (sParam === []) {
        sParam = ''
    }

    //API call
    const params = new URLSearchParams([['sponsorIds', sParam]]);
    var config = {
        method: 'get',
        url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/activity',
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
                setActivities(response.data)
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

    //sorting function
    const whichSort = () => {
        if (wSort===0) {        //sorting by name
            if (isDesc===0) activities.sort((a, b) => a.name.localeCompare(b.name))
            else activities.sort((a, b) => b.name.localeCompare(a.name))
        }
        else if (wSort===1) {   //sorting by deadline
            activities.sort((a, b) => {
                let da = new Date(a.deadline),
                    db = new Date(b.deadline);
                if (isDesc===0) return da - db; else return db - da;
            })
        }
        else if (wSort===2) {   //sorting by points
            if (isDesc===0) activities.sort((a, b) => {return a.points - b.points})
            else activities.sort((a, b) => {return b.points - a.points})
        }
        setTable([...table, activities]);
        return 0;
    }

    return (
        <>
            <Text fontSize="3xl">Activities</Text>
            <Button href = '/activities/create'> <Link href="activities/create">Create Activity</Link></Button>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Activities</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Description</Th>
                            <Th>Deadline</Th>
                            <Th>Points</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {displayActivities(activities)}
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
                                        }}>Name</MenuItem>
                                        <MenuItem as='button' onClick={() => {
                                            wSort = 1;
                                            whichSort();
                                        }}>Deadline</MenuItem>
                                        <MenuItem as='button' onClick={() => {
                                            wSort = 2;
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

export default Activities
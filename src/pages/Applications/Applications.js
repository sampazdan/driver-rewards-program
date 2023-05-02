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
    Container,
    Center,
    Box
    // createColumnHelper
} from '@chakra-ui/react'
import Loading from '../../components/Loading/loading'
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import * as authtools from '../../authtools'
import axios from 'axios'
import {BeatLoader} from "react-spinners";

const Applications = () => {

    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [rowLoading, setRowLoading] = useState(null)
    const [accepted, setAccepted] = useState([])
    const currentSponsor = 'testsponsor'

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams([['sponsorId', currentSponsor]]);

        console.log("AUTH HEADER = " + authtools.getAuthHeader())

        var config = {
            method: 'get',
            url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/applications',
            headers: {
                'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                'Content-Type': 'application/json',
                'Authorization': authtools.getAuthHeader()
            },
            params : params
        };
        const apps = axios(config).then((response) => {
            console.log("GOT BACK : " + JSON.stringify(response.data.applications))
            setApps(response.data.applications)
            setLoading(false)
            //return response.data.applications
        }, error => {
            console.log("ERROR = " + JSON.stringify(error))
        })

    }, [])

    //Accept button component - pass in a user as prop, this will call API to accept application and update interface
    const AcceptButton = ({user}) => {
        function handleClick() {
            setRowLoading(user)

            const params = new URLSearchParams([['sponsorId', currentSponsor], ['userId', user]]);

            var config = {
                method: 'post',
                url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/application',
                headers: {
                    'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                    'Content-Type': 'application/json',
                    'Authorization': authtools.getAuthHeader()
                },
                params : params
            };

            const accepted = axios(config).then((response) => {
                setRowLoading(null)
                setAccepted(current => [...current, user])
            }, error => {
                setRowLoading(null)
                console.log("ERROR = " + JSON.stringify(error))
            })

        }
        if (accepted.includes(user)){
            //console.log("ACCEPTED = " + accepted)
            return <Text color='green'>Accepted</Text>
        } else if(rowLoading === null) {
            return <Button onClick={handleClick}>Accept</Button>
        } else if (rowLoading !== user) {
            return <Button isDisabled={true} onClick={handleClick}>Accept</Button>
        } else {
            return <Loading/>
        }
    }

    if(loading){
        return (
            <Container maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
                <Loading/>
            </Container>
        )
    } else {
        if(apps.length === 0){
            return (
                <>
                    <Text fontSize="3xl">Outstanding Driver Applications</Text>
                    <Center>
                        <Box paddingTop='5em'>
                            <Text fontSize = 'xl'>
                                No outstanding applications
                            </Text>
                        </Box>
                    </Center>
                </>

            )
        }
        return (
            <>
                <Text fontSize="3xl">Outstanding Driver Applications</Text>
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>Driver Applications</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Username</Th>
                                <Th>DOB</Th>
                                <Th>DL#</Th>
                                <Th>Date Submitted</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {/*{driverlist}*/}
                            {apps.map((app) => (
                                <Tr key={app.username}>
                                    <Td>{app.name}</Td>
                                    <Td>{app.username}</Td>
                                    <Td>{app.dob}</Td>
                                    <Td>{app.dlnum}</Td>
                                    <Td>{app.dateApplied}</Td>
                                    <Td>
                                        <AcceptButton user = {app.username}/>
                                    </Td>
                                </Tr>
                            ))}

                        </Tbody>

                    </Table>
                </TableContainer>
            </>
        )
    }
}

export default Applications
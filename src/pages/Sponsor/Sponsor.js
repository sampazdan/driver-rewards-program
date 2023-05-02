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
    Link,
    NavButton,
    Progress, Table, Th, Tr, Thead,
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import { AnimateSharedLayout, motion } from "framer-motion";
import * as authtools from "../../authtools";
import Cookies from 'js-cookie'
import axios from 'axios'
import Loading from "../../components/Loading/loading";
import * as PropTypes from "prop-types";


const baseUrl = 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/'

const mySponsor = Cookies.get('TruckSponsor')


export const Sponsor = () => {

    const [loading, setLoading] = useState(true)

    const [sponsor, setSponsor] = useState(null)

    useEffect(() => {
        setLoading(true)
        const params = new URLSearchParams([['sponsorId', mySponsor]])
        const config = {
            url: baseUrl + 'sponsor',
            method: 'get',
            headers: {
                'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                'Content-Type': 'application/json',
                'Authorization': authtools.getAuthHeader()
            },
            params: params
        }

        const sponsor = axios(config).then((response) => {
            setSponsor(response.data)
            setLoading(false)
            console.log("SPONSOR = " + response.data)
        })

    }, [])

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



                    </Stack>
                    <Box
                        py={{base: '0', sm: '8'}}
                        px={{base: '4', sm: '10'}}
                        bg={{base: 'transparent', sm: 'bg-surface'}}
                        boxShadow={{base: 'none', sm: 'md'}}
                        borderRadius={{base: 'none', sm: 'xl'}}
                        backgroundColor="white"
                    >
                        <Center>
                            <Text fontSize='2xl'>{sponsor.name}</Text>
                        </Center>
                        <Divider marginTop = '20px'/>
                        <FormLabel marginTop='20px' htmlFor="name">Sponsor Name</FormLabel>
                        <Input id="name" type="text" isDisabled={true} value = {sponsor.name} onChange={(event) => {

                        }}/>
                        <FormLabel marginTop='20px' htmlFor="name">Point Value ($/pt)</FormLabel>
                        <Input id="name" type="text" isDisabled={true} value = {sponsor.pointVal} onChange={(event) => {

                        }}/>
                        <Divider marginTop = '20px' marginBottom = '20px'/>
                        <Center>
                            <Link href='/applications' to='/applications' passHref>
                                <Button as = 'a'>View Pending Applications</Button>
                            </Link>
                        </Center>
                    </Box>
                {/*<Center>*/}
                {/*    <Text marginTop= '30px' fontSize='2xl'>Users</Text>*/}
                {/*</Center>*/}
                {/*    <Center>*/}
                {/*    <Table>*/}
                {/*        <Thead>*/}
                {/*            <Tr>*/}
                {/*                <Th>Name</Th>*/}
                {/*                <Th>Email</Th>*/}
                {/*                <Th>DL#</Th>*/}
                {/*                <Th>Points</Th>*/}
                {/*            </Tr>*/}
                {/*        </Thead>*/}
                {/*    </Table>*/}
                {/*    </Center>*/}


            </Container>
        </AnimateSharedLayout>
    )
}

export default Sponsor
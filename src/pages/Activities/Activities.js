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
    Card,
    CardBody,
    CardFooter,
    Heading,
    Image,
    Divider,
    Stack,
    Link
    // createColumnHelper
} from '@chakra-ui/react'

import {useState} from "react";

const activities = [
    {
        name: 'Drive 1000 miles',
        description: 'Drive 1000 miles by Friday for 100 points!',
        deadline: '3/3/2023',
        progress: 45/100,
        points: 100
    },
]

const getActivities = () => {
    let actList = []
    activities.forEach(a => {
        actList.push(<>
        {/*<Th></Th>*/}
        </>)
    })
}



const Activities = () => {

    const [card, setCard] = useState(false)

    const activityCard = (
        <>
            <Card maxW='sm'>
                <CardBody>
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>Drive 1000 miles</Heading>
                        <Text>
                            Drive 1000 miles by Friday for 100 points!
                        </Text>
                        <Text color='blue.600' fontSize='2xl'>
                            100 pts
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Button onClick = {(e) => {
                        setCard(false)
                    }}>Close</Button>
                </CardFooter>
            </Card>
        </>
    )

    if(card){
        return activityCard
    }
    return (
        <>
            <Text fontSize="3xl">Activities</Text>
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>Activities</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Description</Th>
                            <Th>Deadline</Th>
                            <Th>Progress</Th>
                            <Th>Points</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {/*{driverlist}*/}

                        <Tr>
                            <Td>{activities[0].name}</Td>
                            <Td>{activities[0].description}</Td>
                            <Td>{activities[0].deadline}</Td>
                            <Td>
                                <Progress colorScheme='green' size='sm' value={activities[0].progress * 100} />
                            </Td>
                            {/*<Td>{activities[0].progress}</Td>*/}
                            <Td>{activities[0].points}</Td>
                            <Td>
                                <Button onClick = {(e) => {
                                    setCard(true)
                                }}>View</Button>
                            </Td>
                        </Tr>

                    </Tbody>

                </Table>
            </TableContainer>
        </>
    )

}

export default Activities
import React from "react"
import {FormControl, FormLabel, Input, Stack, Image, Center, Button, Text, NumberInput, NumberInputStepper, NumberInputField, NumberIncrementStepper, NumberDecrementStepper} from "@chakra-ui/react";
import {PasswordField} from "../../components/Login/PassField";
import {useEffect, useState} from "react";
import authtools from '../../authtools'
import axios from 'axios'

const baseUrl = 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/'

const requestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf'
    }
}

const ActivityCreate = () => {
    const [activity, setActivity] = useState({
        name: '',
        sponsor: 'hellotrucking',
        maxPts: '100',
        description: '',
        deadline: '05/03/2023'
    })

    const [func, setFunc] = useState('')
    //const [loading, setLoading] = useState(false)

    return (
        <Center>
            <Stack spacing="5">
                <div>
                    <Text fontSize='xl'>New activity for </Text>
                    <Text fontSize='xl' color='blue'>Hello Trucking Inc.</Text>
                </div>
                <Center>

                    <FormControl>
                        <FormLabel htmlFor="email">Name</FormLabel>
                        <Input id="name" type="text" width='300px' placeholder='New Activity' value = {activity.name} onChange={(event) => {
                            setActivity(prevState => ({
                                ...prevState,
                                name: event.target.value
                            }))
                        }}/>


                        <FormLabel htmlFor="email" >Description</FormLabel>
                        <Input id="sponsor" type="text" width='300px' placeholder='Activity Description' value = {activity.description} onChange={(event) => {
                            setActivity(prevState => ({
                                ...prevState,
                                description: event.target.value
                            }))
                        }}/>
                        <FormLabel>Due Date</FormLabel>
                        <Input
                            placeholder="08/25/2000"
                            size="md"
                            type="date"
                            width='300px'

                        />
                        <FormLabel htmlFor="email">Points Available</FormLabel>
                        <NumberInput defaultValue={100} min={10} max={2000}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </Center>
                <Center>
                    <Button width='150px'onClick={(event => {
                        //setLoading(true)
                        const reqBody = {
                            "name" : activity.name,
                            "sponsorId" : activity.sponsor,
                            "maxPts" : activity.maxPts,
                            "description" : activity.description,
                            "deadline" : activity.deadline,
                            "progress" : 1
                        }

                        axios.post(baseUrl + 'activity', reqBody, requestConfig).then((response)=> {
                            window.location.href = '/activities'
                        }, error => {
                            authtools.handleError(error)
                        })
                    })}>Add Activity</Button>
                </Center>
            </Stack>
        </Center>
    )
}

export default ActivityCreate
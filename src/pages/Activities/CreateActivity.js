import React from "react"
import {FormControl, FormLabel, Input, Stack, Image, Center, Button, Text, NumberInput, NumberInputStepper, NumberInputField, NumberIncrementStepper, NumberDecrementStepper} from "@chakra-ui/react";
import {PasswordField} from "../../components/Login/PassField";

const ActivityCreate = () => {
    return (
        <Center>
            <Stack spacing="5">
                <div>
                    <Text fontSize='xl'>New activity for </Text>
                    <Text fontSize='xl' color='blue'>ABC Trucking Co.</Text>
                </div>
                <Center>

                    <FormControl>
                        <FormLabel htmlFor="email">Name</FormLabel>
                        <Input id="text" type="text" width='300px' placeholder='New Activity' onChange={(event) => {

                        }}/>

                        <FormLabel htmlFor="email" >Description</FormLabel>
                        <Input type="text" placeholder='Activity Description'  width='300px' onChange={(event) => {

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
                    <Button width='150px'>Add Activity</Button>
                </Center>
            </Stack>
        </Center>
    )
}

export default ActivityCreate
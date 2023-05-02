import React, {useEffect, useState, useRef} from "react"
import aws from 'aws-sdk'

import {
    FormControl,
    FormLabel,
    Input,
    Stack,
    Image,
    Center,
    Button,
    Text,
    List,
    ListItem,
    ListIcon, Container,
    useToast
} from "@chakra-ui/react";
import {PasswordField} from "../../components/Login/PassField";
import authtools from "../../authtools";
import Loading from "../../components/Loading/loading"
import axios from "axios";

import defaultProfilePic from '../../assets/default-pic.jpg'

const s3_region = 'us-east-1'
const s3_bucket = 'dwp-profile-pictures'
const s3_accessKey = 'AKIAV25YJ7PAQOCO2QNC'
const s3_secretKey = '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'

const s3 = new aws.S3({
    s3_region,
    s3_bucket,
    s3_accessKey,
    s3_secretKey
})

const generateUrl = () => {
    const time_nano = window.performance.now()

    const params = {
        Bucket: s3_bucket,
        Key: time_nano,
        Expires: 60
    }
}

const validPhotos = ['image/jpg', 'image/jpeg', 'image/png']

const Profile = () => {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [editLoading, setEditLoading] = useState(false)
    const [newPhoto, setNewPhoto] = useState(null)
    const [error, setError] = useState("")
    const toast = useToast()

    const [edited, setEdited] = useState({})

    const saveChanges = useRef(null)

    useEffect(() => {
        try{
            setLoading(true)
            authtools.getUser().then((response) => {
                setUser(response.data.user)
                setLoading(false)
                setError('')
            })
        }
        catch(error){
            setLoading(false);
            authtools.handleError(error)
            console.log(error);
        }
    }, [])

    if(loading){
        return (
            <Container paddingTop = '30em' maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
                <Loading/>
            </Container>
        )
    }

    const imageInput = document.querySelector("#pro-pic-upload")

    async function fileHandler(e){
        // console.log(e)
        const image = e.target.files[0]
        console.log(image)

        if (!validPhotos.find(type => type === image.type)) {
            alert("Invalid image type! Please upload a .jpg or .png!")
            return
        }

        setEdited(prevState => ({
            ...prevState,
            'image': ''
        }))

        const fileReader = new FileReader()
        fileReader.readAsDataURL(image);
        fileReader.onload = (event) => {
            const base64Image = event.target.result;
            setNewPhoto(base64Image)
        };
        saveChanges.current.click()
    }

    async function handleSubmit(e) {

        console.log(newPhoto)

        const update = newPhoto ? {
            ...edited,
            image: newPhoto
        } : edited

        //const update = edited
        const params = new URLSearchParams([['userId', user.username]]);

        var config = {
            method: 'patch',
            url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/user',
            headers: {
                'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                'Content-Type': 'application/json',
                'Authorization': authtools.getAuthHeader()
            },
            params : params,
            data : update
        };

        setLoading(true)
        console.log("IMAGE URL BEFORE = "+ user.image)
        const newUser = await axios(config).then((response) => {
            toast({
                title: "Profile Updated!",
                description: "Your profile has been updated.",
                status: "success",
                duration: 5000,
                position: "top"
            })
            setEdited({})
            // console.log("USER DATA " + JSON.stringify(response.data.user))
            setUser(response.data.user)
            // console.log("IMAGE URL AFTER = "+ user.imageUrl)
            // console.log("IMAGE URL IN RESPONSE = " + response.data.user.image)
            setLoading(false)
            return response.data.user
        }, error => {
            console.log("ERROR = " + JSON.stringify(error))
            setError(`Could not update user. Error ${error}`)
            setLoading(false)
        })

    }

    const handleChange = (event, fieldName) => {
        setEdited(prevState => ({
            ...prevState,
            [fieldName]: event.target.value
        }))
    }

    return (
        <Center paddingTop = '7em'>
        <Stack spacing="5">
            <Center>
                <Image
                    borderRadius='full'
                    boxSize='150px'
                    src = {user.image ? user.image : defaultProfilePic}
                    // src = {user.imageUrl}
                    alt='Profile Picture'
                />
            </Center>
            <Center>

                <Button
                    as = "label"
                    htmlFor="imageUpload"
                >
                    Change Picture
                </Button>
                <Input id='imageUpload' type='file' display='none' hidden onChange = {fileHandler}/>
                {/*<Input id='pro-pic-upload' ref={inputPicture} type='file' display='none' onChange = {useState()}/>*/}

            </Center>
            <FormLabel htmlFor="email">Sponsor Company</FormLabel>
            <Text size='xl'>ABC Trucking Co.</Text>
            <Button width='300px' alignItems="center">Apply to a Sponsor</Button>
            <Center>

            <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" type="text" width='300px' placeholder = 'Name' defaultValue = {user.name} onChange={(event) => {
                    handleChange(event, 'name')
                }}/>

                <FormLabel htmlFor="username" >Username</FormLabel>
                <Input id="username" isDisabled={true} type="text" placeholder='Username' defaultValue = {user.username} width='300px' onChange={(event) => {

                }}/>

                <FormLabel htmlFor="email" >Email</FormLabel>
                <Input id="email" isDisabled={false} type="text" placeholder='Email' defaultValue = {user.email} width='300px' onChange={(event) => {
                    handleChange(event, 'email')
                    console.log("EDITED = " + JSON.stringify(edited))
                }}/>

                <FormLabel htmlFor="dlNum" >DL #</FormLabel>
                <Input id="email" isDisabled={false} type="text" placeholder='Email' defaultValue = {user.dlNum} width='300px' onChange={(event) => {
                    handleChange(event, 'dlNum')
                    console.log("EDITED = " + JSON.stringify(edited))
                }}/>

                <FormLabel>Date of Birth</FormLabel>
                <Input
                    size="md"
                    type="date"
                    disabled={true}
                    defaultValue="2000-08-25"
                    width='300px'
                />
            </FormControl>
            </Center>
            <Center>
                <Button width='150px' ref = {saveChanges} onClick = {handleSubmit} isDisabled = {Object.keys(edited).length === 0}>Save Changes</Button>
            </Center>
            <Text color = "red">
                {error}
            </Text>
        </Stack>
        </Center>
    )
}

export default Profile
import {BeatLoader} from "react-spinners";
import {AbsoluteCenter, Center, Text, Box} from "@chakra-ui/react";

const Loading = (props) => {

    const loadText = props.text

    return (
        <Center>
            <BeatLoader color = "#3181ce"/>
            <Text fontSize='m'>{loadText}</Text>
        </Center>
    )
}

export default Loading


import React from 'react'
import {
    Flex,
    Heading,
    Text,
    Icon
} from '@chakra-ui/react'

export default function NavHoverBox({ title, icon, description }) {
    return (
        <>
            <Flex
                pos="absolute"
                mt="calc(100px - 7.5px)"
                ml="-10px"
                width={150}
                height={0}
                borderTop="5px solid transparent"
                borderBottom="5px solid transparent"
                borderRight="5px solid #82AAAD"
            />
            
        </>
    )
}

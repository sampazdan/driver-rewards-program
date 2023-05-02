import React, { useState } from 'react';
import {
  Textarea,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
} from '@chakra-ui/react';

const Messages = ({ messages, unreadMessages, sendMessage, markAsRead }) => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    sendMessage(to, message);
    setMessage('');
  };

  const handleClick = (id) => {
    markAsRead(id);
  };

  return (
    <VStack spacing={4}>
      <Box>
        <Textarea
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </Box>
      <Box>
        <Textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Box>
      <Button colorScheme="green" onClick={handleSend}>
        Send
      </Button>
      <Box>
        {unreadMessages.map((message) => (
          <Box
            key={message.id}
            onClick={() => handleClick(message.id)}
            cursor="pointer"
            borderBottom="1px solid"
            borderColor="gray.200"
            pb={2}
            mb={2}
          >
            <HStack>
              <Badge colorScheme="red">New</Badge>
              <Text fontWeight="bold">{message.from}</Text>
              <Text>{message.body}</Text>
            </HStack>
          </Box>
        ))}
        {messages.map((message) => (
          <Box
            key={message.id}
            onClick={() => handleClick(message.id)}
            cursor="pointer"
            borderBottom="1px solid"
            borderColor="gray.200"
            pb={2}
            mb={2}
          >
            <HStack>
              <Badge colorScheme="gray">{message.read ? 'Read' : 'New'}</Badge>
              <Text fontWeight={message.read ? 'normal' : 'bold'}>
                {message.from}
              </Text>
              <Text>{message.body}</Text>
            </HStack>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default Messages;

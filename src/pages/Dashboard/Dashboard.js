import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import PointHistory from '../PointHistory/PointHistory';
import authtools from '../../authtools';
import Loading from '../../components/Loading/loading';
import Graph from '../../components/PointGraph/Graph';
import Activities from '../Activities/Activities';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button, Select } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import utils from '../../utils';
import { FaEnvelope } from 'react-icons/fa';
import { IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from '@chakra-ui/react';
import Messages from '../Messages/Messages';
import Users from '../Users/Users'

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [view, setView] = useState(0);
  const [adview, setAdview] = useState(0);
  const [spview, setSpview] = useState(0)

  useEffect(() => {
    try {
      setLoading(true);
      authtools.getUser().then((response) => {
        console.log('AT GETDATA = ' + JSON.stringify(response.data));
        setLoading(false);
        setUser(response.data.user);
        setView(response.data.user.accountType);
        console.log('View is ' + view);
      });
    } catch (error) {
      setLoading(false);
      authtools.handleError(error);
      console.log(error);
    }
  }, []);


  console.log("VIEW IS " + view)

  const handleSendMessage = (to, body) => {
    const newMessage = {
      id: messages.length + 1,
      from: user.username,
      to,
      body,
      read: false,
    };
    setMessages([...messages, newMessage]);
  };

  const handleOpenMessages = () => {
    setIsMessagesOpen(true);
    setUnreadMessages([]);
    setMessages(
        messages.map((message) => ({
          ...message,
          read: true,
        }))
    );
  };

  if (loading) {
    return <Loading />;
  }


  //ADMIN
  if (view == 3){
    if (adview == 0){
      return (
          <div>
            <Select value={adview} onChange={(event) => setAdview(parseInt(event.target.value))} variant="filled" maxWidth="200px" mx="auto" mb="1em">
              <option value={0}>Admin</option>
              <option value={1}>Sponsor</option>
              <option value={2}>Driver</option>
            </Select>
            ADMIN VIEW:
          </div>
      );
    }
    if (adview == 1){
      return (
          <Router>
            <div>
              <IconButton
                  icon={<FaEnvelope />}
                  className="message"
                  aria-label="Messages"
                  onClick={handleOpenMessages}
                  style={{ position: 'absolute', top: '20px', right: '10px' }} // Added style to position the icon
              />

              <Drawer isOpen={isMessagesOpen} placement="right" onClose={() => setIsMessagesOpen(false)}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Messages</DrawerHeader>
                  <DrawerBody>
                    <Messages messages={messages} unreadMessages={unreadMessages} sendMessage={handleSendMessage} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

              <Select value={adview} onChange={(event) => setAdview(parseInt(event.target.value))} variant="filled" maxWidth="200px" mx="auto" mb="1em">
                <option value={0}>Admin</option>
                <option value={1}>Sponsor</option>
                <option value={2}>Driver</option>
              </Select>



              <Tabs isFitted variant="soft-rounded" colorScheme="green">
                <TabList mb="1em">
                  <Tab>Activities</Tab>
                  <Tab>Catalog</Tab>
                  <Tab>My Drivers</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Button onClick={() => { window.location.href = '/activities/create' }} href="/activities/create">Create Activity</Button>
                    <Activities />
                  </TabPanel>
                  <TabPanel>
                    <p>Catalog:</p>
                  </TabPanel>
                  <TabPanel>
                    <Users/>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </Router>
      );
    }


    if (adview == 2){
      return (
          <Router>
            <div>
              <IconButton
                  icon={<FaEnvelope />}
                  className="message"
                  aria-label="Messages"
                  onClick={handleOpenMessages}
                  style={{ position: 'absolute', top: '20px', right: '10px' }} // Added style to position the icon
              />

              <Drawer isOpen={isMessagesOpen} placement="right" onClose={() => setIsMessagesOpen(false)}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Messages</DrawerHeader>
                  <DrawerBody>
                    <Messages messages={messages} unreadMessages={unreadMessages} sendMessage={handleSendMessage} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

              <Select value={adview} onChange={(event) => setAdview(parseInt(event.target.value))} variant="filled" maxWidth="200px" mx="auto" mb="1em">
                <option value={0}>Admin</option>
                <option value={1}>Sponsor</option>
                <option value={2}>Driver</option>
              </Select>
              <Tabs isFitted variant="soft-rounded" colorScheme="green">
                <TabList mb="1em">
                  <Tab>Activities</Tab>
                  <Tab>Catalog</Tab>
                  <Tab>Points</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Activities />
                  </TabPanel>
                  <TabPanel>
                    <p>Catalog:</p>
                  </TabPanel>
                  <TabPanel>
                    {/*<Graph/>*/}
                    <PointHistory/>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </Router>
      );
    }
  }

//UNAPPROVED DRIVER
  if (view == 0){
    return (
        <div>
          You Have Not Yet Been Approved
        </div>
    );
  }

  //APPROVED DRIVER
  if (view == 1){
    return (
        <Router>
          <div>


            <IconButton
                icon={<FaEnvelope />}
                className="message"
                aria-label="Messages"
                onClick={handleOpenMessages}
                style={{ position: 'absolute', top: '20px', right: '10px' }} // Added style to position the icon
            />

            <Drawer isOpen={isMessagesOpen} placement="right" onClose={() => setIsMessagesOpen(false)}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Messages</DrawerHeader>
                <DrawerBody>
                  <Messages messages={messages} unreadMessages={unreadMessages} sendMessage={handleSendMessage} />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Tabs isFitted variant="soft-rounded" colorScheme="green">
              <TabList mb="1em">
                <Tab>Activities</Tab>
                <Tab>Catalog</Tab>
                <Tab>Points</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Activities />
                </TabPanel>
                <TabPanel>
                  <p>Catalog:</p>
                </TabPanel>
                <TabPanel>
                  <Graph/>
                  <PointHistory/>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </Router>
    );
  }

  //SPONSOR
  if (view == 2){
    if (spview == 0){

      return (
          <Router>
            <div>
              <Select value={spview} onChange={(event) => setSpview(parseInt(event.target.value))} variant="filled" maxWidth="200px" mx="auto" mb="1em">
                <option value={0}>Sponsor</option>
                <option value={1}>Driver</option>
              </Select>
              <IconButton
                  icon={<FaEnvelope />}
                  className="message"
                  aria-label="Messages"
                  onClick={handleOpenMessages}
                  style={{ position: 'absolute', top: '20px', right: '10px' }} // Added style to position the icon
              />

              <Drawer isOpen={isMessagesOpen} placement="right" onClose={() => setIsMessagesOpen(false)}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Messages</DrawerHeader>
                  <DrawerBody>
                    <Messages messages={messages} unreadMessages={unreadMessages} sendMessage={handleSendMessage} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
              <Tabs isFitted variant="soft-rounded" colorScheme="green">
                <TabList mb="1em">
                  <Tab>Activities</Tab>
                  <Tab>Catalog</Tab>
                  <Tab>My Drivers</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Button onClick={() => { window.location.href = '/activities/create' }} href="/activities/create">Create Activity</Button>
                    <Activities />
                  </TabPanel>
                  <TabPanel>
                    <p>Catalog:</p>
                  </TabPanel>
                  <TabPanel>
                    My Drivers:
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </Router>
      );
    }
    if (spview == 1){
      return (
          <Router>
            <div>

              <Select value={spview} onChange={(event) => setSpview(parseInt(event.target.value))} variant="filled" maxWidth="200px" mx="auto" mb="1em">
                <option value={0}>Sponsor</option>
                <option value={1}>Driver</option>
              </Select>
              <IconButton
                  icon={<FaEnvelope />}
                  className="message"
                  aria-label="Messages"
                  onClick={handleOpenMessages}
                  style={{ position: 'absolute', top: '20px', right: '10px' }} // Added style to position the icon
              />

              <Drawer isOpen={isMessagesOpen} placement="right" onClose={() => setIsMessagesOpen(false)}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Messages</DrawerHeader>
                  <DrawerBody>
                    <Messages messages={messages} unreadMessages={unreadMessages} sendMessage={handleSendMessage} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
              <Tabs isFitted variant="soft-rounded" colorScheme="green">
                <TabList mb="1em">
                  <Tab>Activities</Tab>
                  <Tab>Catalog</Tab>
                  <Tab>Points</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Activities />
                  </TabPanel>
                  <TabPanel>
                    <p>Catalog:</p>
                  </TabPanel>
                  <TabPanel>
                    <Graph/>
                    <PointHistory/>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </Router>
      );
    }
  }

};

export default Dashboard;
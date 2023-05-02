import "./Catalog.css"
import {useState} from "react";
import {useEffect} from "react";
import Cookies from 'js-cookie'

import * as authtools from '../../authtools'
import axios from "axios";
import {
    Table,
    Td,
    Th,
    Thead,
    Tr,
    Tbody,
    Image,
    Button,
    Text,
    Center,
    Divider,
    Input,
    Box,
    Container
} from "@chakra-ui/react";
import Loading from "../../components/Loading/loading";


function Catalog() {

    const initialView = Cookies.get('TruckAccountType')

    const [catalog, setCatalog] = useState([]);
    // const [cleanCat, setCleanCat] = useState([]);
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    const [view, setView] = useState(initialView)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState([])


    useEffect(() => {

        const fetchUserAndCatalog = async () => {
            try {
                setLoading(true);

                let currentUser = user

                if (!user) {
                    const response = await authtools.getUser();
                    setUser(response.data.user);
                    currentUser = response.data.user
                    setError('');
                }

                const params = new URLSearchParams([['sponsorId', currentUser.sponsorIds[0]]]);

                const config = {
                    method: 'get',
                    url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/catalog',
                    headers: {
                        'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                        'Content-Type': 'application/json',
                        'Authorization': authtools.getAuthHeader()
                    },
                    params: params
                };

                if (!(view === 'sponsor-add')) {
                    const catalogResponse = await axios(config);
                    setCatalog(catalogResponse.data.catalog);
                    // console.log("GOT BACK : " + JSON.stringify(catalogResponse.data.catalog));
                } else {
                    setCatalog([]);
                }
            } catch (error) {
                console.log("CATCH ERROR = " + error.message);
                setError(true);
                //window.location.reload(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCatalog();
    }, [view]);

        if(loading){
            return (
                <Container maxW="lg" py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
                    <Loading/>
                </Container>
            )
        }

        const getSearchResults = async () => {
            setLoading(true)
            const params = new URLSearchParams([['term', search], ['entity', 'musicTrack'], ['limit', 25]])

            const config = {
                method: 'get',
                url: 'https://itunes.apple.com/search',
                params: params
            }

            const returnedItems = await axios(config).then((response) => {
                // console.log("RESULTS = " + JSON.stringify(response))
                setLoading(false)
                return response.data.results
            }, error => {
                console.log("ERROR = " + JSON.stringify(error))
                setError("Error getting itunes data")
                setLoading(false)
            })

            const formattedItems = returnedItems.map((item) => {
                console.log(item.trackName)
                const newItem = {
                    id: item.trackId,
                    item: item,
                    price: item.trackPrice
                }
                return newItem
            })

            setCatalog(formattedItems)

        }

        const addSelectedToCatalog = async () => {
            setLoading(true)
            const params = new URLSearchParams([['sponsorId', user.sponsorIds[0]]])

            const config = {
                method: 'post',
                url: 'https://o63s0n6hl9.execute-api.us-east-1.amazonaws.com/login-demo/catalog',
                headers: {
                    'x-api-key': 'x6GaDjuUzPa0MBiphcMoo30GQJm06K6IaD6sSPWf',
                    'Content-Type': 'application/json',
                    'Authorization': authtools.getAuthHeader()
                },
                params: params,
                data: {
                    'items': selected
                }
            }

            const returnedItems = await axios(config).then((response) => {
                // console.log("RESULTS = " + JSON.stringify(response))
                setLoading(false)
                setView('sponsor')
                return response.data.results
            }, error => {
                console.log("ERROR = " + JSON.stringify(error))
                setError("Error getting itunes data")
                setLoading(false)
            })
            //
            // const formattedItems = returnedItems.map((item) => {
            //     console.log(item.trackName)
            //     const newItem = {
            //         id: item.trackId,
            //         item: item,
            //         price: item.trackPrice
            //     }
            //     return newItem
            // })

            //setCatalog(returnedItems)
        }

        const addToSelected = (item) => {
            if (selected.some(addedItem => addedItem.id === item.id)) {
                // item remove
                setSelected(selected.filter(addedItem => addedItem.id !== item.id));
            } else {
                // item add
                setSelected([...selected, item]);
            }
        };

        const getButtonText = (item) => {
            const text = selected.some(addedItem => addedItem.id === item.id) ? 'Item added' : (view === 'sponsor-add' ? 'Add item' : 'View');
            return text
        };

        selected.forEach((item) => {
            console.log("SELECTED = " + item.id + " NAME = " + item.item.trackName)
        })

        return (
            <div class="catalog">
                <h1>Catalog</h1>
                {view === 'sponsor' && (
                    <Button onClick = {() => {
                        console.log("GOING TO ADD")
                        setView('sponsor-add')
                        setCatalog([])
                    }}>
                        Add catalog items
                    </Button>
                )}

                {view === 'sponsor-add' && (
                    <Button onClick = {() => {
                        console.log("GOING TO ADD")
                        setView('sponsor')
                        setCatalog([])
                    }}>
                        Back to catalog
                    </Button>
                )}

                {view === 'sponsor-add' && (
                    <>
                        <Input marginTop = '20px' placeholder="Search the iTunes store" value = {search} id="searchCatalog" onChange={
                            (e) => {
                                setSearch(e.target.value)
                                //console.log("SEARCH = " + search)

                            }
                        }/>
                        <Center>
                            <Button marginTop='20px' colorScheme='blue' onClick={ () => {
                                getSearchResults()
                            }}> Search </Button>
                            {selected.length === 0 ? '' : (
                                <Button marginTop='20px' marginLeft = '15px' colorScheme='green' onClick={ () => {
                                    console.log("SELECTED = " + JSON.stringify(selected))
                                    addSelectedToCatalog()
                                    setSelected([])
                                }}> Add Selected To Catalog </Button>
                            )}
                        </Center>
                        <Center>
                            {/*<Text marginTop='20px'>Selected Items: </Text>*/}
                            {/*<Box>*/}
                            {/*    <Center>*/}
                            {/*        <*/}
                            {/*    {selected.map((item) => (*/}
                            {/*        <Text>{item.id}</Text>*/}
                            {/*    ))}*/}
                            {/*    </Center>*/}
                            {/*</Box>*/}
                        </Center>

                    </>
                )}
                <Box maxHeight='1000px' overflowY='auto' marginTop = '30px'>
                    <Center>
                        {catalog.length === 0 ? 'Nothing to see here!' : (
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th></Th>
                                        {/*<Th>Type</Th>*/}
                                        <Th>Artist</Th>
                                        <Th>Price</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {/*{cleanCatalog.map((item) => (*/}
                                    {/*    <Tr key={item.id}>*/}
                                    {/*))}*/}

                                    {catalog.map((item) => (
                                        item.item.wrapperType.toLowerCase() === 'track' ? (
                                            <Tr key={item.id}>
                                                <Td>
                                                    <Center>
                                                        <Image src={item.item.artworkUrl100}/>
                                                    </Center>
                                                    <br/>
                                                    <Divider/>
                                                    <br/>
                                                    <Center>
                                                        <Text>{item.item.trackName}</Text>
                                                    </Center>
                                                </Td>
                                                <Td>{item.item.artistName}</Td>
                                                <Td>{item.price}</Td>

                                                <Td>
                                                    <Button onClick={() => addToSelected(item)}>
                                                        {getButtonText(item)}
                                                    </Button>
                                                </Td>

                                            </Tr>
                                            ) : (
                                            <Tr key={item.id}>
                                                <Td>
                                                    <Center>
                                                        <Image src={item.item.artworkUrl100}/>
                                                    </Center>
                                                    <br/>
                                                    <Divider/>
                                                    <br/>
                                                    <Center>
                                                        <Text>{item.item.collectionName}</Text>
                                                    </Center>
                                                </Td>
                                                <Td>{item.item.artistName}</Td>
                                                <Td>{item.price}</Td>

                                                <Td>
                                                    <Button onClick={() => addToSelected(item)}>
                                                        {getButtonText(item)}
                                                    </Button>
                                                </Td>

                                            </Tr>
                                        )
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </Center>


                </Box>
            </div>
        );
}




export default Catalog
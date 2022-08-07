// Home component displays all of the listed marketplace items ie. available nfts, datasets etc

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button } from "react-bootstrap"

// fetches marketplace to get all listed items (pass in marketplace address)
// fetch the nft metadata (item location) from the nft contract address 
const Home = ({ marketplace, nft}) => {
    const [ items, setItems ] = useState([]) //store items in the useState (ie. on the frontend)
    const [loading, setLoading] = useState(true) //keep track of loading items
    
    //load marketplace items
    const loadMarketplaceItems = async() => {
        const itemCount = await marketplace.itemCount()
        
        //declare array to store marketplace items on the front end
        let items = []
        for (let i=1; i<= itemCount; i++){
            const item = await marketplace.items(i)
            if(item.sold) {
                const uri = await nft.tokeURI(item.tokenID) //get URI from the nft contract
                const response = await fetch(uri) //fetch the nft metadata from IPFS
                const metadata = await response.json() 
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
                //add item to items array
                items.push({
                    totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                })
            }
        }
        //add the fetched items to state
        setItems(items)
        setLoading(false)
    
    }

    // buy market item function allows users to but an nft on the app gui
    // it calls the purchase item function in the marketplace contract passing the item id and total price
    const buyMarketItem = async (item) => {
        await (await marketplace.purchaseItem(item.itemId, {value: item.total})).wait()
        loadMarketplaceItems() //reloads the marketplace to remove the recently purchased item from the marketplace
    }

    useEffect(() => {
        loadMarketplaceItems()
    }, [])

    //return loading page if the marketplace items have not finished loading
    if (loading) return (
        <main style={{padding: "1rem 0"}}>
            <h2>Loading...</h2>
        </main>
    )

    return (
        <div className="flex justify-center">
            {items.length > 0 ?   //check if items length is greater than zero before rendering the page
                <div className="px-5 container">
                    <Row xs={1} md={2} lg={4} className="g-4 py-5">
                        {/* map each item in the items array to a card on the marketplace frontend */}
                        {items.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image} />
                                    <Card.Body color="secondary">
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className="d-grid">
                                            <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                                                But for {ethers.utils.formatEther(item.totalPrice)} ETH
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
                : (     // if not, display "No listed assets"
                    <main style={{padding: "1rem 0"}}>
                        <h2>No listed assets</h2>
                    </main>
                )
            }
        </div>
    )
}

export default Home;
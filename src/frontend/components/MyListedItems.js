import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap"

function renderSoldItems(items) {
    return (
        <>
            <h2>Sold!</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {items.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden">
                        <Card>
                            <Card.Img variant="top" src={item.image} />
                            <Card.Footer>
                                For {ethers.utils.formatEther(item.totalPrice)} ETH - Received {ethers.utils.formatEther(item.price)} ETH
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default function MyListedItems( { marketplace, nft, account }) {
    //state variables to track the users items on the frontend
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])

    //function to load the users listed items
    const loadListedItems = async() => {
        const itemCount = await marketplace.itemCount()
        let listedItems = []
        let soldItems = []

        for( let i=1; i<= itemCount; i++) {
            const indx = await marketplace.items(i)
            if(indx.seller.toLowerCase() == account) {
                const uri = await nft.tokenURI(indx.tokenId)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await marketplace.getTotalPrice(indx.itemId)

                let item = {
                    totalPrice,
                    price: indx.price,
                    itemId: indx.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                }

                //push updated item to the listedItems array
                listedItems.push(item)
                
                //push to sold array of the item is sold
                if (indx.sold) {
                    soldItems.push(item)
                }
            }
        }
        setLoading(false)
        setListedItems(listedItems)
        setSoldItems(soldItems)
    }

    useEffect(() => {
        loadListedItems()
    }, [])

    if (loading) return (
        <main style={{ padding: "1rem 0"}}>
            <h2>Loading...</h2>
        </main>
    )
    return (
        <div className="flex justify-center">
            {listedItems.length > 0 ? 
                <div className="px-5 py-3 container">
                    <h2>Listed</h2>
                    <Row xs={1} md={2} lg={4} className="g-4 py-3">
                        {listedItems.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image} />
                                    <Card.Footer>
                                        {ethers.utils.formatEther(item.totalPrice)} ETH 
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {soldItems.length > 0 && renderSoldItems(soldItems)}
                </div>
                : (
                    <main  style={{ padding: "1rem 0" }}>
                        <h2>No listed assets!</h2>
                    </main>
                )}
        </div>
    );
}
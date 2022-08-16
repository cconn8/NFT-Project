import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap"


export default function MyPurchases({ marketplace, nft, account}) {
    const [loading, setLoading] = useState(true)
    const [purchase, setPurchases] = useState([])

    //load purchased items 
    const loadPurchasedItems = async() => {
        //fetch the purchased items from the marketplace
        const filter = marketplace.filters.Bought(null, null, null, null, null, account) //set all fields to null except the buyer field (account) to get buyer purchases
        const results = await marketplace.queryFilter(filter) //filter method on the marketplace contract querys events with the buyer set as the user
        
        //grab the data of each NFT and add to the listed Item object
        const purchases = await Promise.all(results.map(async i => { 
            //grab arguments from each returned result
            i = i.args
            const uri = await nft.tokenURI(i.tokenId)
            const response = await fetch(uri)
            const metadata = await response.json()
            const totalPrice = await marketplace.getTotalPrice(i.itemId)

            //define the listed item object on the front end
            let purchasedItem = {
                totalPrice,
                price: i.price,
                itemId: i.itemId,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                data: metadata.data
            }

            return purchasedItem
        }))
        setLoading(false)
        setPurchases(purchases)
    }

    useEffect(() => {
        loadPurchasedItems()
    }, [])

    if (loading) return (
        <main style={{ padding: "1rem 0"}}>
            <h2>Loading...</h2>
        </main>
    )
    return(
        <div className="flex justify-center">
            {/* check that the purchases array lenth is > 0 */}
            {purchases.length > 0 ? 
                <div className="px-4 container">
                    <Row xs={1} md={2} lg={4} className="g-4 py-5">
                        {purchases.map((item, idx) => (
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
                </div>
                : (
                    <main style={{padding: "1 rem 0"}}>
                        <h2>No purchases</h2>
                    </main>
                )}
        </div>
    );
}
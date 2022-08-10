import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button} from "react-bootstrap"
import { create as ipfsHttpClient } from 'ipfs-http-client' //interface to ipfs

//instantiate ipfs client
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {

    //create states for what we want to keep track of in the app
    const[image, setImage] = useState('')  // image to represent nft metatdata
    const[price, setPrice] = useState(null)
    const[name, setName] = useState('')
    const[description, setDescription] = useState('')

    //upload function to IPFS
    //takes the upload in the input field and stores it in IPFS -> returning the CID
    const uploadToIPFS = async(event) => {
        event.preventDefault()
        const file = event.target.files[0]
        //check it is a valid file being uploaded
        if (typeof file !== 'undefined') {
            try {   //try/catch for potential errors with the upload 
                const result = await client.add(file)
                console.log(result)
                setImage('https://ipfs.infura.io/ipfs/'+result.path)
            } catch(error) {
                console.log("Error uploading image data to IPFS: ", error)
            }
        }
        console.log("Uploaded to IPFS!")
    }

    //create nft function. Triggered when user clicks submit on create form.
    //takes all the data from the Create function (name, image, price etc. )
    //first interacts with IPFS to upload all of the data in the submit form
    //second interacts with the blockchain to mint the NFT
    const createNFT = async() => {
        //verify all data fields have been filled on the create form
        if (!image || !price || !name|| !description) return 

        try {  //try/catch to verify upload is successful
            const result = await client.add(JSON.stringify({image, name, description}))
            mintThenList(result)
        } catch(error) {
            console.log("error with ipfs upload URI ", error)
        }
        console.log("Created NFT!")
    }

    const mintThenList = async(result) => {
        //pointer to nft metadata in IPFS
        const uri = "https://ipfs.infura.io/ipfs/"+result.path
        console.log("Retrieved IPFS path: " + uri)

        await (await nft.mint(uri)).wait()          // mint the nft on the blockchain
        
        const id = await nft.tokenCount          // get the tokenId of the new nft
        console.log("token count complete!")
        
        await (await nft.setApprovalForAll(marketplace.address, true)).wait() //approve/allow the marketplace to spend the nft
        const listingPrice = ethers.utils.parseEther(price.toString())       //create the listing on the market place.. add to markeplace
        console.log("listingPrice complete")
        
        await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()  //*** -BREAKING HERE!!!!1
        console.log("makeitem complete")

        console.log("mintThenList function successfully complete!")
    }

    return (
        // Create upload form 
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: '1000px'}}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            {/* form type takes a file as upload, calls the UploadToIPFS function */}
                            <Form.Control type="file" name="file" onChange={uploadToIPFS}/>
                            {/* nft name field, once triggered calls the setName function passing the name on the input form */}
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" type="text" placeholder="Name"/>
                            {/* nft description field */}
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" as="textarea" placeholder="Description"/>
                            {/* set price field */}
                            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" type="number" placeholder="Price in ETH"/>
                            
                            {/* button to create the NFT */}
                            <div className="d-grid px-0">
                                <Button onClick={createNFT} variant="primary" size="lg">
                                    Create & List NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Create;
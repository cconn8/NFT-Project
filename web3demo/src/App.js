import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import web3 from 'web3';
import Web3 from 'web3';

async function connectWallet(){ //function used to interact with Web3 (Ethereum blockchain)
  try{
    if(window.ethereum) {  //if True (wallet/ethereum interface exists in the browser (metamask))
      var web3 = new Web3(window.ethereum);   //establish a web3 connection to the wallet
      await window.ethereum.send('eth_requestAccounts'); //send a request to get accounts
      var accounts = await web3.eth.getAccounts();    //grab the returned wallet address and store it in a variable
      account = accounts[0];  //take the first wallet address found/returned
      document.getElementById('wallet-address').textContent = account;  //display the "account" (address) on the html page

      contract = new web3.eth.Contract(ABI, ADDRESS) //create a contract (interfaces with the ABI) to trigger actions
      document.getElementById('mint').onClick = async () => {  //when the user hits Mint button, execute the following commands
          var _mintAmount = Number(document.querySelector("[name=amount").value)  //take the amount value and store in _mintAmount (SC variable)
          var mintRate = Number(await contract.methods.cost().call());   //call the cost method to calculate price of mint. Specifies value of NFT as defined in the Smart Contract
          var totalAmount = mintRate * _mintAmount;
          contract.methods.mint(account, _mintAmount).send({from: account, value: String(totalAmount)});
      }
    }
  }
  catch(ex) {
    console.log(ex)
  }
}

function App() {
  return (
    <div className="App">
      <div className='container'>
        <div className='row'>
          <form class="gradient col-lg-5 mt-5" style={{borderRadius:"25px", boxShadow:"1px 1px 15px #000000"}}>
            <h4 style={{color: "#FFFFFF"}}>IoT-NFT App</h4>

            <section>
              <Button style={{marginBottom:"5px", marginRight:"5px"}}>Connect Device</Button><Button onClick={connectWallet} style={{marginBottom:"5px", marginLeft:"5px"}}>Connect Wallet</Button>
            </section>

            <form>
              <h5 style={{color: "#FFFFFF"}}>Enter Details</h5>
              <label>Data Owner</label><br></br>
              <input type="text"></input><br></br>

              <label>Description</label><br></br>
              <input type="text"></input><br></br>

              <label>Upload Interval seconds</label><br></br>
              <input type="text"></input><br></br>

              <Button style={{marginTop:"5px",marginBottom:"5px"}}>Submit Details</Button>
            </form>

            <section>
              <Button style={{marginBottom:"5px"}}>Start/Upload</Button>
            </section>

            <div class="card" id="wallet-address" style={{marginTop:"3px", boxShadow:"1px 1px 4px #000000"}}>
              <label style={{color: "#000000"}} for="floatingInput">Wallet Address</label>
              <input type="number" name="amount" defaultValue="1" minimum="1" maximum="5"/>
              <label style={{color: "#FFFFFF"}}>Please select the amount of NFTs to mint</label>
              <Button>Mint/Buy</Button>
              <label style={{color: "#FFFFFF"}}>Price 0.06 ETH each mint.</label>
            </div>
            <section>
              <Button style={{marginTop:"5px", marginBottom:"5px"}}>Sell/Transfer</Button>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

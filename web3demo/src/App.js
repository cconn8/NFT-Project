import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <div className='container'>
        <div className='row'>
          <form class="gradient col-lg-5 mt-5" style={{borderRadius:"25px", boxShadow:"1px 1px 15px #000000"}}>
            <h4 style={{color: "#FFFFFF"}}>IoT-NFT App</h4>

            <section>
              <Button style={{marginBottom:"5px"}}>Connect Device</Button><Button style={{marginBottom:"5px"}}>Connect Wallet</Button>
            </section>

            <form>
              <h5 style={{color: "#FFFFFF"}}>Enter Details</h5>
              <label>Data Owner</label><br></br>
              <input type="text"></input><br></br>

              <label>Description</label><br></br>
              <input type="text"></input><br></br>

              <label>Upload Interval seconds</label><br></br>
              <input type="text"></input><br></br>

              <Button style={{marginBottom:"5px"}}>Submit Details</Button>
            </form>

            <section>
              <Button style={{marginBottom:"5px"}}>Start/Upload</Button>
            </section>
            <div class="card" id="wallet-address" style={{marginTop:"3px", boxShadow:"1px 1px 4px #000000"}}>
              <label style={{color: "#FFFFFF"}} for="floatingInput">Wallet Address</label>
              <input type="number" name="amount" defaultValue="1" minimum="1" maximum="5"/>
              <label style={{color: "#FFFFFF"}}>Please select the amount of NFTs to mint</label>
              <Button>Mint/Buy</Button>
            </div>
            <label style={{color: "#FFFFFF"}}>Price 0.06 ETH each mint.</label>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

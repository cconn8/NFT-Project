
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png' //CHANGE IMAGE !!!!
import { connect } from 'socket.io-client';

// removed = sendMessage, setMessage, from Navigation arguments
const Navigation = ({web3Handler, account, connectToServer}) => {
    return (
        <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <img src={market} width="40" height="40" className="" alt="" />
                    &nbsp; IoT Data Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                    {/* <Button onClick={sendMessage} variant="outline-light" 
                            onChange={(event) => {
                            setMessage(event.target.value)
                        }}> Send Message 
                    </Button> */}
                        {/* if account is loaded (ie. web3handler called correctly), display account */}
                        {account ? (
                            <Nav.Link
                                href={'https://etherscan.io/address/'+account}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-buttin btn-sm mx-4">
                                    <Button variant="outline-light">
                                        {account.slice(0,5) + '...' + account.slice(38,42)}
                                    </Button>
                                </Nav.Link>
                        // else display the connect wallet button
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                            
                        )}
                        {/* DEVICE CONNECTION IF? */}
                        {connect ? (
                            <Nav.Link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-buttin btn-sm mx-4">
                                    <Button variant="outline-light">
                                       Connected to Server 
                                    </Button>
                                </Nav.Link>
                        // else display the connect wallet button
                        ) : (
                            <Button onClick={connectToServer} variant="outline-light">Connect Backend</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;
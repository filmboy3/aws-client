import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import ReactAudioPlayer from 'react-audio-player';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import takeOnMe from './audio/takeOnMe.mp3'

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      soundOn: true,
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    let { soundOn } = this.state
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar collapseOnSelect style={{backgroundColor: 'black', borderColor: 'black'}}>
          <Navbar.Collapse>
            <Nav pullRight>
            {this.state.isAuthenticated
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Begin</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
            }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      <div className="staticTop">
      <img className="flipped_image" src={require('./images/BlueDecoration.png')} alt="top_decoration"/>
      <div>
      </div>
      <img id="dino" src={require('./images/Main_Logo.png')} height="15%" width="15%" alt="logo" />
        {soundOn && <ReactAudioPlayer
        src={takeOnMe}
        autoPlay
        loop={true}
        volume={.1}
      /> }
         
          <Routes childProps = {childProps}/>
        </div>
        <KeyboardEventHandler
          handleKeys={['ctrl+x']}
          onKeyEvent={(key, e) => {
              console.log('Mute triggered')
              soundOn = !soundOn;
              this.setState({
                soundOn
              })
            }
          }   
        />
      </div>
    );
  }
}

export default withRouter(App);
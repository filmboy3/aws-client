import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
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
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">The Onboarding Trail</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
            {this.state.isAuthenticated
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Begin</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Continue</NavItem>
                  </LinkContainer>
                </Fragment>
            }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="staticTop">
        <img className="flipped_image" src={require('./images/BlueDecoration.png')} alt="top_decoration"/>
          <div>
          <img id="dino" src={require('./images/Main_Logo.png')} height="15%" width="15%" alt="logo" />
          </div>
          <Routes childProps = {childProps}/>
          <img src={require('./images/BlueDecoration.png')} alt="bottom_decoration"/>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
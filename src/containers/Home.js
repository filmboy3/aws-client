import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import decor from '../images/BlueDecoration.png';
import cityscape from '../images/CityScape.gif';
import office from '../images/MainSetPiece.gif';
import "./Home.css";
import Iframe from 'react-iframe';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get("notes", "/notes");
  }

  renderNotesList(notes) {
    return (
      <div>
        <img id="flipped_image" src={decor} alt="decoration"/>
        <h1>WELCOME</h1>
        <img src={cityscape} id="city_scape" alt="city-scape"/>
        <img src={office} alt="office"/>
        <Iframe url="http://www.youtube.com/embed/xDMP3i36naA"
        width="450px"
        height="450px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        allowFullScreen/>
        <img id="flipped_image" src={decor} alt="decoration"/>
      </div>
    )

  }

  renderLander() {
    return (
      <div className="lander">
        <img id="flipped_image" src={decor} alt="decoration"/>
        <h1>THE ONBOARDING TRAIL</h1>
        <img src={office} alt="main-office"/>
        <img src={decor} alt="decoration"/>
        <div>
          <Link to="/signup" className="btn btn-success btn-lg">
            Begin Journey
          </Link>
          <Link to="/login" className="btn btn-info btn-lg">
            Continue Journey
          </Link>
        </div>
        <br/>
        <p>Made with <span role="img" aria-label="heart">❤️</span> using React and serverless AWS</p>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
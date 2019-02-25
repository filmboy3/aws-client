import takeOnMe from '../audio/takeOnMe.mp3'
import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import shortid from 'shortid';
import { Link } from "react-router-dom";
import decor from '../images/BlueDecoration.png';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import cityscape from '../images/CityScape.gif';
import ReactAudioPlayer from 'react-audio-player';
import office from '../images/MainSetPiece.gif';
import scottStatic from '../images/ScottGalloway.png';
import "./Home.css";
import { text } from "../text/text.js";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: [],
      soundOn: true,
      textCounter: 0,
      players: ['Raj', 'Kliment', 'Runtao', 'Bruce', 'Sabbir'],
      playerName: 'Bob',
      text: text,
      masterData: [],
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

  newName = (key) => {
    if (this.state.players[key-1]) {
      this.setState({
        playerName: this.state.players[key-1] 
      })
      if (this.state.text[this.state.textCounter+1]) {
        this.setState({
          textCounter: this.state.textCounter + 1
        })
      }
    }
  }

  coffee = (key) => {
    if (key === 'n'){
      alert(`Jonathan respects your decision and will not ask you out for coffee in real life, ${this.state.playerName}. But for the purpose of the app, would you mind playing along ...?`)
    }
    
    if (this.state.text[this.state.textCounter+1]) {
      this.setState({
        textCounter: this.state.textCounter + 1
      })
    }
  }

  renderNotesList(notes, props) {
    let sound = this.state.soundOn;
    let lineRender = [];
    text[this.state.textCounter].forEach(line => {
        if (line.includes("{scottStatic}")){
          // let item = line.slice(1, -1);
          lineRender.push(
            <img src={scottStatic} alt="scottStatic" height="50%" width="50%" />
          )
        } else {
          lineRender.push(
            <p key={shortid.generate()}>{line.replace("NAMEPLACEHOLDER", `${this.state.playerName}`)}</p>
          );
        }
      })
     
    return (
      <div>
        <img className="flipped_image" src={decor} alt="decoration"/>
        <h1>THE ONBOARDING TRAIL</h1>
        {sound && <ReactAudioPlayer
          src={takeOnMe}
          autoPlay
          volume={.1}
        /> }

        <div class="textBlock">{lineRender}</div>
        <KeyboardEventHandler
          handleKeys={['numeric']}
          onKeyEvent={(key, e) => {
              // console.log('Numeric triggered');
              switch (this.state.textCounter) {
                case 2:
                  this.newName(key);
                  break;
                default:
                  break;
              }
            }
          }   
        />
        <KeyboardEventHandler
          handleKeys={['y', 'n']}
          onKeyEvent={(key, e) => {
              console.log('Yes or No triggered')
              switch (this.state.textCounter) {
                case 4:
                  this.coffee(key);
                  break;
                default:
                  break;
              }
            }
          }
          />  
        <KeyboardEventHandler
          handleKeys={['space']}
          onKeyEvent={(key, e) => {
              console.log('Spacebar triggered')
              if (this.state.text[this.state.textCounter+1]) {
                this.setState({
                  textCounter: this.state.textCounter + 1
                })
              }
            }
          }   
        />
        <KeyboardEventHandler
          handleKeys={['ctrl+s']}
          onKeyEvent={(key, e) => {
              console.log('Mute triggered')
              let soundOn = !this.state.soundOn;
              this.setState({
                soundOn
              })
            }
          }   
        />
        <img src={decor} alt="decoration"/>
      </div>
    )

  }

  renderLander(props) {
    return (
      <div className="lander">
        <img className="flipped_image" src={decor} alt="decoration"/>
        <h1>THE L2 ONBOARDING TRAIL</h1>
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
        {/* <PageHeader>Your Notes</PageHeader> */}
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
import ReactAudioPlayer from 'react-audio-player';
import takeOnMe from '../audio/takeOnMe.mp3'
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import React, { Component } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { Progress } from 'react-sweet-progress';
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { text } from "../text/text.js";
import imagesCache from './ImageHelper.js'
import shortid from 'shortid';
import { modal_data } from './Modal.js';
import "react-sweet-progress/lib/style.css";
import "./Home.css";
import Coffee from "../components/coffee.js";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: [],
      soundOn: true,
      modalVisible: false,
      textCounter: 0,
      players: ['Raj', 'Kliment', 'Runtao', 'Bruce', 'Sabbir'],
      otherPlayers: [],
      playerName: 'Scott',
      eventCounter: 0,
      text: text,
      progress: 0,
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
  
  nameRandomizer = () => {
    const { players } = this.state;
    return players[Math.floor(Math.random()*players.length)];
  }
  nextSlide = () => {
    const {text, textCounter, modalVisible, eventCounter} = this.state;
    if (text[textCounter+1]) {
      
      if (textCounter > 2) {
        this.setState({
          modalVisible: !modalVisible,
          eventCounter: eventCounter + 1
        }) 
        
      }
      let progress = (((textCounter+2) / text.length) * 100).toFixed(2);
      console.log(progress);
      this.setState({
        textCounter: textCounter + 1,
        progress
      })
    }
  }


  newName = (key) => {
    const { players } = this.state;
    if (key === '6') {
      let playerName = window.prompt("Sure! Please enter your name:", "Scott Galloway");
      this.setState({
        playerName,
        otherPlayers: players
      });
      this.nextSlide();
    }
    if (players[key-1]) {
      let otherPlayers = players.filter(player => player !== players[key-1]);
      this.setState({
        playerName: players[key-1],
        otherPlayers 
      })
      this.nextSlide();
    }
  }

  coffee = (key) => {
    if (key === 'n'){
      alert(`Jonathan respects your decision and will not ask you out for coffee in real life, ${this.state.playerName}. But for the purpose of the app, would you mind playing along ...?`)
    }
    this.nextSlide();
  }

  parser = (name, string) => {
    return string.replace("NAMEPLACEHOLDER", `${name}`)
  }

  renderNotesList(notes, props) {

    let { soundOn, modalVisible, progress, playerName, textCounter, text, eventCounter } = this.state;
    let modalClose = () => this.setState({ modalVisible: false });
    let parsedEvent = this.parser(this.nameRandomizer(), modal_data[eventCounter][1])

    let lineRender = [];
    text[textCounter].forEach((line) => {
      let imageCheck = false;
      Object.keys(imagesCache).forEach(key => {
        if (line.includes(key)){
          imageCheck = true;
          lineRender.push(
            <img className="imageInsert" key={shortid.generate()} src={`${imagesCache[key]}`} alt={key}/>
          )
        }
      })
        if (!imageCheck) {
          lineRender.push(
            <p key={shortid.generate()}>{line.replace("NAMEPLACEHOLDER", `${playerName}`)}</p>
          );
        }
      })

    return (
      <div key={shortid.generate()}>

        {soundOn && <ReactAudioPlayer
          src={takeOnMe}
          autoPlay
          volume={.1}
        /> }
        <Progress percent={progress}/>
          <Modal
            key="modal" 
            className="modal_trail"
            show={modalVisible}
            onHide={modalClose}
          >
          <Modal.Header closeButton />
            <Modal.Body>
              <div>
                <img className="imageInsert" key={shortid.generate()} src={`${modal_data[eventCounter][0]}`} alt={`${modal_data[eventCounter][2]}`}/>
                <p>{parsedEvent}</p>
              </div>
            </Modal.Body>
        </Modal>

        

        <div className="textBlock" key={shortid.generate()}>
            {lineRender}
        </div>
        {textCounter === 5 && 
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <ControlLabel>Coffee Shop</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.restaurant}
              componentClass="textarea"
            />
            <FormControl
              onChange={this.handleChange}
              value={this.state.order}
              componentClass="textarea"
            />
          </FormGroup>
          <Button variant="primary" type="submit">
             Submit
          </Button>
          </form>}
        <KeyboardEventHandler
          handleKeys={['numeric']}
          onKeyEvent={(key, e) => {
              switch (textCounter) {
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
              switch (textCounter) {
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
              this.nextSlide();
            }
          }   
        />
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
    )

  }

  renderLander(props) {
    return (
      <div className="lander" key={shortid.generate()}>
        <div>
          <Link to="/signup" className="btn btn-success btn-lg">
            Begin Journey
          </Link>
          <Link to="/login" className="btn btn-info btn-lg">
            Continue Journey
          </Link>
        </div>
        <br/>
        <p key={shortid.generate()}>Made with <span role="img" aria-label="heart">❤️</span> with React and serverless AWS</p>
      </div>
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  
  }

  handleSubmit = async event => {
    event.preventDefault();
    try {
      await this.createNote({
        content: this.state.content
      });
    } catch (e) {
      alert(e);
    }
  }

  renderNotes() {
    return (
      <div className="notes">
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home" key={shortid.generate()}>
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
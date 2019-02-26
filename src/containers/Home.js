import React, { Component } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { Progress } from 'react-sweet-progress';
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Button } from 'semantic-ui-react';
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

      let progress = (((textCounter+2) / text.length) * 100).toFixed(2);
      console.log(`Progress: ${progress}, textCounter: ${textCounter}`);
      this.setState({
        textCounter: textCounter + 1,
        progress
      })

      
      if (textCounter > 2) {
        setTimeout(() => {
          this.setState({
            modalVisible: !modalVisible,
            eventCounter: eventCounter + 1
          }) 
        }, 3000)
        
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
    console.log("Inside Coffee func with key: ", key)
    if (key === 'n'){
      alert(`Jonathan respects your decision and will not ask you out for coffee in real life, ${this.state.playerName}. But for the purpose of the app, would you mind playing along ...?`)
    }
    this.nextSlide();
  }

  parser = (name, string) => {
    return string.replace(/NAMEPLACEHOLDER/g, `${name}`)
  }

  renderNotesList(notes, props) {

    let { modalVisible, progress, playerName, textCounter, text, eventCounter } = this.state;
    let modalClose = () => this.setState({ modalVisible: false });
    let parsedEvent = this.parser(this.nameRandomizer(), modal_data[eventCounter][1])

    let lineRender = [];
    text[textCounter].forEach((line) => {
      let imageCheck = false;
      let buttonCheck = false;
      if (line.includes('CONTINUE_BUTTON')) {
        lineRender.push(
          <p><Button inverted color='green' onClick={this.nextSlide}>Onward</Button></p>
        )
        buttonCheck = true;
      }
      Object.keys(imagesCache).forEach(key => {
        if (line.includes(key)){
          imageCheck = true;
          lineRender.push(
            <img className="imageInsert" key={shortid.generate()} src={`${imagesCache[key]}`} alt={key}/>
          )
        }
      })
        if (!imageCheck && !buttonCheck) {
          lineRender.push(
            <p key={shortid.generate()}>{line.replace("NAMEPLACEHOLDER", `${playerName}`)}</p>
          );
        }
      })

    return (
      <div key={shortid.generate()}>
    

        <Progress percent={progress}/>
          <Modal
            key="modal" 
            className="modal_trail"
            show={modalVisible}
            onHide={modalClose}
          >
            <Modal.Header closeButton>
                <Modal.Title className="News">The Gartner Times</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div>
                <img className="imageInsert" key={shortid.generate()} src={`${modal_data[eventCounter][0]}`} alt={`${modal_data[eventCounter][2]}`}/>
                <p>{parsedEvent}</p>
              </div>
            </Modal.Body>
        </Modal>

        {textCounter === 5 && <Coffee userName={playerName} />}

        <div className="textBlock" key={shortid.generate()}>
            {lineRender}
        </div>
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
      
      </div>
    )

  }

  renderLander(props) {
    return (
      <div className="lander" key={shortid.generate()}>
        <div>

        <p key={shortid.generate()}>Welcome to Jonathan's <span id="western">Onboarding Trail</span>, an interactive survey</p>
          <Link to="/signup"><Button inverted color='green'>New Journey</Button></Link>
          <Link to="/login"><Button inverted color='green'>Login</Button></Link>
        <p> Made with <span role="img" aria-label="heart">❤️</span> with React and serverless AWS</p>
        <img className="imageInsert" key={shortid.generate()} src={`${imagesCache.main_office}`} alt={'main_office'}/>
        </div>
        <br/>
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
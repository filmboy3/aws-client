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
import ImageFadeIn from 'react-image-fade-in'
import { modal_data } from './Modal.js';
import "react-sweet-progress/lib/style.css";
import decor from '../images/BlueDecoration.png';
import NPM from '../components/npmQuestion.js';
import Coffee from "../components/coffee.js";
import Hobbies from "../components/hobbiesQuestion.js";
import Expectations from "../components/expectationsQuestion.js";
import Strengths from "../components/strengthsQuestion.js";
import TechStack from "../components/techStack.js";
import TopQuality from "../components/TopQuality.js";
import "./Home.css";

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
  
  handleImageChange = () => {
    this.setState({
      imageClass: 'image-loaded'
    })
  }
  
  nameRandomizer = () => {
    const { otherPlayers } = this.state;
    return otherPlayers[Math.floor(Math.random()*otherPlayers.length)];
  }
  nextSlide = () => {
    const {text, textCounter, modalVisible, eventCounter} = this.state;
    let progress = (((textCounter+2) / text.length) * 100).toFixed(2);
    console.log(`Progress: ${progress}, textCounter: ${textCounter}`);
      this.setState({
        textCounter: textCounter + 1,
        imageClass: 'image',
        progress,
      })

      
      if (textCounter > 2) {
       
          this.setState({
            modalVisible: !modalVisible,
            eventCounter: eventCounter + 1
          }) 

        
      }
      window.scrollTo(0, 0)
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
    let buttonRender = [];
    let imageRender = [];
    text[textCounter].forEach((line) => {
      let imageCheck = false;
      let buttonCheck = false;
      if (line.includes('CONTINUE_BUTTON')) {
        buttonRender.push(
          <p><Button inverted color='green' onClick={this.nextSlide}>Onward</Button></p>
        )
        buttonCheck = true;
      }
      if (line.includes('SCHEDULE_BUTTON')) {
        buttonRender.push(
          <p><a href={'https://calendly.com/jonathan-p-schwartz/gartner/'} target={"_blank"}><Button inverted color='blue' onClick={this.nextSlide}>Schedule Coffee Now</Button></a></p>
        )
        buttonCheck = true;
      }
      Object.keys(imagesCache).forEach(key => {
        if (line.includes(key)){
          imageCheck = true;
          imageRender.push(
            <ImageFadeIn loadAsBackgroundImage={false} opacityTransition={1} height={"75%"} width={"75%"} className={`imageInsert`} src={`${imagesCache[key]}`} />
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
        <img src={decor} alt="bottom_decor"/>
          <Modal
            key="modal" 
            className="modal_trail"
            show={modalVisible}
            onHide={modalClose}
            height={'500px'}
            width={'500px'}
          >
            <Modal.Header closeButton>
                <Modal.Title className="News">The Gartner Times</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div>
                <p>{parsedEvent}</p>
              <ImageFadeIn loadAsBackgroundImage={false} opacityTransition={1} className={`modalInsert`} src={`${modal_data[eventCounter][0]}`} />
              </div>
            </Modal.Body>
        </Modal>


        <div className="textBlock" key={shortid.generate()}>
            {lineRender}
            {imageRender}
        {textCounter === 5 && <Coffee userName={playerName} />}
        {textCounter === 6 && <NPM userName={playerName} />}
        {textCounter === 7 && <TechStack userName={playerName} title={"current"} placeholder={"Current Stack: Languages, Frameworks, Databases"}/>}
        {textCounter === 8 && <TechStack userName={playerName} title={"wishlist"} placeholder={"WishList: Languages, Frameworks, Databases"}/>}
        {textCounter === 9 && <Strengths userName={playerName} title={"Strengths/Weaknesses"}/>}
        {textCounter === 10 && <Expectations userName={playerName} id={"Expectations"} title={"Expectations of Jonathan"} placeholder={"...Besides slaying at company Karaoke nights"}/>}
        {textCounter === 11 && <Hobbies userName={playerName}/>}
        {textCounter === 12 && <TopQuality userName={playerName} id={"TopQualities"} title={"TopQualities"} placeholder={"Underwater Basket Weaving"}/>}
            {buttonRender}
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
        
      </div>
    )

  }

  renderLander(props) {
    return (
      <div className="lander" key={shortid.generate()}>
        <div>
        <br/>
        <p key={shortid.generate()}>Welcome to Jonathan's <span id="western">Onboarding Trail</span>, an Interactive Survey</p>
        <img className="imageInsert" key={shortid.generate()} src={`${imagesCache.main_office}`} alt={'main_office'}/>
          <Link to="/signup"><Button className="splash" inverted color='green'>New Journey</Button></Link>
          <Link to="/login"><Button className="splash" inverted color='green'>Login</Button></Link>
          <br/>
        <p> Made with <span role="img" aria-label="heart">❤️</span> with React and serverless AWS</p>
        <img src={decor} alt="bottom_decor"/>

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
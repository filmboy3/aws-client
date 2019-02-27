import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default class Coffee extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            strength: "",
            weakness: ""
        };
      }

      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        event.preventDefault();
        const { strength, weakness } = this.state;
        const { userName } = this.props;
        let content = `${userName} believes their greatest weakness is '${weakness}' and their greatest strength is '${strength}'`;
        try {
          await this.createNote({
            content
          });
          toast(
            {
                type: 'success',
                icon: 'save',
                description: <p>Saved ... feel free to submit more!</p>
            },
        );
          this.setState({
            strength: '',
            weakness: ''
            })
        } catch (e) {
          alert(e);
        }
      }
      createNote(note) {
        return API.post("notes", "/notes", {
          body: note
        });
      }
   render() {
     const { userName } = this.props;
       return (
           <div>
        <SemanticToastContainer position="bottom-right"/>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label style={{color: 'grey'}}>{userName}'s strengths</label>
            <input
                id="strength"
                placeholder='Technical Communication'
                onChange={this.handleChange}
                value={this.state.strength}
                componentClass="textarea"
             />
          </Form.Field>
          <Form.Field>
            <label style={{color: 'grey'}}>{userName}'s areas for improvement</label>
            <input
                placeholder='Not incorporating testing'
                id="weakness"
                onChange={this.handleChange}
                value={this.state.weakness}
                componentClass="textarea"
             />
          </Form.Field>
            <Button inverted color='grey' type="submit">Submit</Button>
        </Form>
        </div>
       )
    }
}

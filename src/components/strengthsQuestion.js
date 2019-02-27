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
        console.log(content);
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
       return (
           <div>
        <SemanticToastContainer />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label style={{color: 'grey'}}>Strong Suit</label>
            <input
                id="strength"
                placeholder='Technical Communication'
                onChange={this.handleChange}
                value={this.state.strength}
                componentClass="textarea"
             />
          </Form.Field>
          <Form.Field>
            <label style={{color: 'grey'}}>Area for improvement</label>
            <input
                placeholder='Not Using Testing'
                id="weakness"
                onChange={this.handleChange}
                value={this.state.weakness}
                componentClass="textarea"
             />
          </Form.Field>
            <Button type="submit">Submit</Button>
        </Form>
        </div>
       )
    }
}

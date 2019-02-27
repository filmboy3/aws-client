import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default class Expectations extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          expectations: ''
        };
      }

      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        event.preventDefault();
       
        const { userName } = this.props;
        let content = `${userName} expects Jonathan to: '${this.state.expectations}'`;
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
            <label style={{color: 'grey'}}>{userName}'s Expectations</label>
            <input
                id="expectations"
                placeholder="Ideating on new solutions, slaying at company karaoke nights, etc."
                onChange={this.handleChange}
                value={this.state.expectations}
                componentClass="textarea"
             />
          </Form.Field>
            <Button inverted color='gray' type="submit">Submit</Button>
        </Form>
        </div>
       )
    }
}

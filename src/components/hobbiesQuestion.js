import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default class Hobbies extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          hobbies: '',
          loading: ''
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
        let content = `${userName} has the following hobby: '${this.state.hobbies}'`;
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
            hobbies: '',
            loading: ''
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
        <SemanticToastContainer position="bottom-right" />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label style={{color: 'grey'}}>{userName}'s Hobbies</label>
            <input
                id="hobbies"
                placeholder="Underwater Basket Weaving"
                onChange={this.handleChange}
                value={this.state.hobbies}
                componentClass="textarea"
             />
          </Form.Field>
            <Button inverted className={this.state.loading} color='green' type="submit">Submit</Button>
        </Form>
        </div>
       )
    }
}

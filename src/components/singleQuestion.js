import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default class SingleQuestion extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            data: "",
        };
      }

      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        event.preventDefault();
        const { data } = this.state;
        const { userName, title } = this.props;
        let content = `${title}: ${userName}, '${data}'`;
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
            data: '',
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
            <label style={{color: 'grey'}}>{this.props.title}</label>
            <input
                id={this.props.id}
                placeholder={this.props.placeholder}
                onChange={this.handleChange}
                value={this.state.data}
                componentClass="textarea"
             />
          </Form.Field>
            <Button type="submit">Submit</Button>
        </Form>
        </div>
       )
    }
}

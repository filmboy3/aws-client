import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default class Coffee extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            restaurant: "",
            order: "",
            loading: ''
        };
      }

      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        this.setState({
          loading: 'loading'
        })
        event.preventDefault();
        const { restaurant, order } = this.state;
        const { userName } = this.props;
        let content = `${userName} would like to order '${order}' from '${restaurant}'`;
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
            restaurant: '',
            order: '',
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
       return (
           <div>
        <SemanticToastContainer position="bottom-right"/>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label style={{color: 'grey'}}>Favorite Coffee Spot</label>
            <input
                id="restaurant"
                placeholder='La Colombe on Lafayette'
                onChange={this.handleChange}
                value={this.state.restaurant}
                componentClass="textarea"
             />
          </Form.Field>
          <Form.Field>
            <label style={{color: 'grey'}}>Favorite Order</label>
            <input
                placeholder='Espresso'
                id="order"
                onChange={this.handleChange}
                value={this.state.order}
                componentClass="textarea"
             />
          </Form.Field>
            <Button className ={this.state.loading} inverted color='grey' type="submit">Submit</Button>
        </Form>
        </div>
       )
    }
}

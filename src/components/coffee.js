import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import { API } from "aws-amplify";

export default class Coffee extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            isLoading: false,
            restaurant: "",
            order: ""
        };
      }

      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        event.preventDefault();
        const { restaurant, order } = this.state;
        const { userName } = this.props;
        let content = `${userName} wants ${order} from ${restaurant}`;
        console.log(content);
        try {
          await this.createNote({
            content
          });
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
        <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Favorite Spot</ControlLabel>
          <FormControl
            id="restaurant"
            onChange={this.handleChange}
            value={this.state.restaurant}
            componentClass="textarea"
          />
          <ControlLabel>Go-To Order</ControlLabel>
          <FormControl
            id="order"
            onChange={this.handleChange}
            value={this.state.order}
            componentClass="textarea"
          />
        </FormGroup>
        <Button variant="primary" type="submit">
           Submit
        </Button>
        </form>
       )
    }
}

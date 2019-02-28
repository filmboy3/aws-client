import React, { Component } from 'react'
import { Form, Radio } from 'semantic-ui-react'
import './TopQuality.css';
import { Button } from 'semantic-ui-react';
import { API } from "aws-amplify";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

export default class Qualities extends Component {
  state = {
    loading: ''
  }
  handleChange = (e, { value }) => this.setState({ value })
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: 'loading'
    })
    const { value } = this.state;
    const { userName } = this.props;
    let content = `${userName} ranks this as a top quality: ${value}`;
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
        value: [],
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
      <Form>
        <Form.Field>
          Highest valued: <b>{this.state.value}</b>
        </Form.Field>
        <Form.Field>
          <Radio
            label='Positive Attitude'
            name='radioGroup'
            value='positivity'
            checked={this.state.value === 'positivity'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='High-end user focus'
            name='radioGroup'
            value='user'
            checked={this.state.value === 'user'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='A great team player'
            name='radioGroup'
            value='team-player'
            checked={this.state.value === 'team-player'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Deep and broad technical experience'
            name='radioGroup'
            value='technical-ability'
            checked={this.state.value === 'technical-ability'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Quick Learning Ability'
            name='radioGroup'
            value='quick-learner'
            checked={this.state.value === 'quick-learner'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Great at time and task management'
            name='radioGroup'
            value='time-management'
            checked={this.state.value === 'time-management'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Supreme Communication Skills'
            name='radioGroup'
            value='communication'
            checked={this.state.value === 'communication'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Button className={this.state.loading} inverted color='grey' onClick={this.handleSubmit} type="submit">Submit</Button>
      </Form> 
     </div> 
    )
  }
}
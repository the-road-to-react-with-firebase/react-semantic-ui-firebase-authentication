import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { Form, Message, Button } from 'semantic-ui-react';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <Form onSubmit={this.onSubmit}>
        {error && (
          <Message negative>
            <p>{error.message}</p>
          </Message>
        )}
        <Form.Group widths="equal">
          <Form.Field>
            <label>Old Password</label>
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="New Password"
            />
          </Form.Field>
          <Form.Field>
            <label>New Password</label>
            <input
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm New Password"
            />
          </Form.Field>
        </Form.Group>
        <Button primary disabled={isInvalid} type="submit">
          Reset My Password
        </Button>
      </Form>
    );
  }
}

export default withFirebase(PasswordChangeForm);

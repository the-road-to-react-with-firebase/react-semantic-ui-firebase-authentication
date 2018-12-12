import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { withFirebase } from '../Firebase';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import {
  Grid,
  Card,
  Header,
  Message,
  Form,
  Button,
} from 'semantic-ui-react';

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
  {
    id: 'twitter.com',
    provider: 'twitterProvider',
  },
];

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <Header as="h2">Account: {authUser.email}</Header>
        <Grid columns={2}>
          <Grid.Column>
            <Card fluid={true}>
              <Card.Content>
                <Card.Header>Reset Password</Card.Header>
                <Card.Description>
                  <PasswordForgetForm />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid={true}>
              <Card.Content>
                <Card.Header>New Password</Card.Header>
                <Card.Description>
                  <PasswordChangeForm />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        <LoginManagement authUser={authUser} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods, error: null }),
      )
      .catch(error => this.setState({ error }));
  };

  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onDefaultLoginLink = password => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password,
    );

    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onUnlink = providerId => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <Card fluid={true}>
        <Card.Content>
          <Card.Header>Sign In Methods</Card.Header>
          <Card.Description>
            {error && (
              <Message negative>
                <p>{error.message}</p>
              </Message>
            )}
            <div>
              {SIGN_IN_METHODS.map(signInMethod => {
                const onlyOneLeft = activeSignInMethods.length === 1;
                const isEnabled = activeSignInMethods.includes(
                  signInMethod.id,
                );

                return (
                  <span key={signInMethod.id}>
                    {signInMethod.id === 'password' ? (
                      <Grid columns={1}>
                        <Grid.Column>
                          <DefaultLoginToggle
                            onlyOneLeft={onlyOneLeft}
                            isEnabled={isEnabled}
                            signInMethod={signInMethod}
                            onLink={this.onDefaultLoginLink}
                            onUnlink={this.onUnlink}
                          />
                          <br />
                        </Grid.Column>
                      </Grid>
                    ) : (
                      <SocialLoginToggle
                        onlyOneLeft={onlyOneLeft}
                        isEnabled={isEnabled}
                        signInMethod={signInMethod}
                        onLink={this.onSocialLoginLink}
                        onUnlink={this.onUnlink}
                      />
                    )}
                  </span>
                );
              })}
            </div>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <Button
      color={
        signInMethod.id === 'google.com'
          ? 'google plus'
          : signInMethod.id === 'facebook.com'
          ? 'facebook'
          : signInMethod.id === 'twitter.com'
          ? 'twitter'
          : ''
      }
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Button
      color={
        signInMethod.id === 'google.com'
          ? 'google plus'
          : signInMethod.id === 'facebook.com'
          ? 'facebook'
          : signInMethod.id === 'twitter.com'
          ? 'twitter'
          : ''
      }
      type="button"
      onClick={() => onLink(signInMethod.provider)}
    >
      Link {signInMethod.id}
    </Button>
  );

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);

    this.state = { passwordOne: '', passwordTwo: '' };
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: '', passwordTwo: '' });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      onlyOneLeft,
      isEnabled,
      signInMethod,
      onUnlink,
    } = this.props;

    const { passwordOne, passwordTwo } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return isEnabled ? (
      <span>
        <Button
          type="button"
          onClick={() => onUnlink(signInMethod.id)}
          disabled={onlyOneLeft}
        >
          Deactivate {signInMethod.id}
        </Button>
        <br />
      </span>
    ) : (
      <Form onSubmit={this.onSubmit}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>New Password</label>
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="New Password"
            />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
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
          Link {signInMethod.id}
        </Button>
      </Form>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);

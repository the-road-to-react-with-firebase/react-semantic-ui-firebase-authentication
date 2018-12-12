import React, { Component } from 'react';
import { distanceInWordsToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Feed, Icon, Form, Button } from 'semantic-ui-react';

export const TimeAgo = ({ time }) => (
  <time>{distanceInWordsToNow(time)} ago</time>
);

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <Feed.Event>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User as={Link} to={`/`}>
              {message.user.username || message.user.userId}
            </Feed.User>
            <Feed.Date>
              <TimeAgo time={message.createdAt} />
            </Feed.Date>
          </Feed.Summary>
          <Feed.Extra>
            {editMode ? (
              <Form>
                <Form.Field>
                  <input
                    type="text"
                    value={editText}
                    onChange={this.onChangeEditText}
                  />
                </Form.Field>
              </Form>
            ) : (
              <span>
                {message.text}{' '}
                {message.editedAt && <span>(Edited)</span>}
              </span>
            )}
          </Feed.Extra>
          <Feed.Meta>
            {editMode ? (
              <span>
                <Button icon onClick={this.onSaveEditText}>
                  <Icon color="green" name="save outline" />
                </Button>
                <Button icon onClick={this.onToggleEditMode}>
                  <Icon color="blue" name="undo alternate" />
                </Button>
              </span>
            ) : (
              <span>
                <Button icon onClick={this.onToggleEditMode}>
                  <Icon color="blue" name="edit outline" />
                </Button>
                <Button
                  icon
                  onClick={() => onRemoveMessage(message.uid)}
                >
                  <Icon color="red" name="trash alternate" />
                </Button>
              </span>
            )}
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default MessageItem;

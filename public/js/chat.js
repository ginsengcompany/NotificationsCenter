$(document).ready(function() {
  "use strict";

  class ChatApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { messages: [], users: [] };
    }

    componentDidMount() {
      this.socket = io();
      this.socket.on('users', this.usersList.bind(this));
      this.socket.on('message', this.messageReceive.bind(this));
      this.socket.on('connect_error', this.connectionError.bind(this));

      $.ajax({
        url: '/messages',
        dataType: 'json',
        success: (data) => {
          this.setState({ messages: data });
        },
        failure: (xhr, status, err) => {
          this.connectionError();
        }
      });
    }

    connectionError() {
      $('#main').html('<p><div class="alert alert-danger">An error occured, please refresh the page and try again.</div></p>');
    }

    usersList(users) {
      this.setState({ users: users });
    }

    messageReceive(msg) {
      let messages = this.state.messages;
      messages.push(msg);
      this.setState({ messages: messages });
    }

    render() {
      return (


          <div id="frame" className='chatApp'>
            <div class="row">
            </div>
            <div id="sidepanel">
              <div id="contacts">
                <UsersList users={this.state.users}/>
              </div>
            </div>
            <div class="content">
              <div class="messages">
                <MessagesList messages={this.state.messages}/>
                <MessageForm socket={this.socket}/>
              </div>
            </div>
          </div>
      )
    }
  }

  class UsersList extends React.Component {
    render() {
      return (
          <ul>
              {this.props.users.map(function(user) {
                  return <li class="contact" key={user}>
                        <div class="wrap">
                          <img src="http://www.top-madagascar.com/assets/images/admin/user-admin.png" alt="" />
                          <div class="meta">
                            <p class="name">{user}</p>
                            <p class="preview">online</p>
                          </div>
                        </div>
                      </li>;
              })}
          </ul>
      )
    }
  }

  class MessageForm extends React.Component {
    constructor(props) {
      super(props);
      this.messageSend = this.messageSend.bind(this);
    }

    setCaretPosition(ctrl, pos) {
      if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
      } else if (ctrl.createTextRange) {
        let range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }

    messageSend(e) {
      if (e.keyCode === 13) {
        e.preventDefault();

        if (e.target.value) {
          this.props.socket.emit('message', { message: e.target.value });
          e.target.value = '';
        }

        this.setCaretPosition(e.target, 100);
      }
    }

    render() {
      return (
        <div className="message-input">
          <textarea className="form-control" id="input" rows="1" placeholder='Scrivi il tuo messaggio ...' autoFocus onKeyDown={this.messageSend}></textarea>
        </div>
      )
    }
  }

  class MessagesList extends React.Component {
    constructor(props) {
      super(props);
    }

    componentWillUpdate() {
      let node = ReactDOM.findDOMNode(this);
      this.shouldScrollBottom = Math.ceil(node.scrollTop) + 1 + node.offsetHeight >= node.scrollHeight;
    }

    componentDidUpdate() {
      if (this.shouldScrollBottom) {
        let node = ReactDOM.findDOMNode(this);
        node.scrollTop = node.scrollHeight
      }
    }

    render() {
      return (
        <div className="messages-list">
          <div id="content">
            {this.props.messages.map(function(msg) {
              return <Message key={msg['id']} message={msg}></Message>
            })}
          </div>
        </div>
      );
    }
  }

  class Message extends React.Component {

    render() {
      let body = this.props.message['body'].replace(new RegExp('\ ','g'), ' ').replace(new RegExp('\r?\n','g'), '<br />');
      return   <ul>
        <li class="sent">
          <b class="name">{this.props.message['user']['cognome']} {this.props.message['user']['nome']}</b>&nbsp;<h7 class="name">il {moment(this.props.message['created_at']).format("YYYY-MM-DD HH:mm:ss")}</h7>
          <hr/>
          <p>{body}</p>
        </li>
      </ul>

    }
  }

  ReactDOM.render(<ChatApp />, document.getElementById('main'));
});

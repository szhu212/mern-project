import React from 'react';
import config from '../../config';
import io from 'socket.io-client';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Theme from '../game/theme'
import "./room_show.css"
import backgroundImage from "../../images/gameroom3.jpg";


// import MessageInput from './message_input';
// import './App.css';

class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      content: ''
    };
    this.handleContent = this.handleContent.bind(this)
    this.handleSubmit =this.handleSubmit.bind(this)
    this.handleExit = this.handleExit.bind(this)  
    this.handleRolePlay = this.handleRolePlay.bind(this)
    this.handleThemeUnmount = this.handleThemeUnmount.bind(this)
    this.handleExitGame = this.handleExitGame.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.room.users) {
      
      
      if (this.props.room.users.length !== Object.keys(this.props.users).length )
      {
        this.props.fetchUsers({user_ids: this.props.room.users})}
      }
    

    if (this.props.match.params.roomId !== prevProps.room._id ) {
      this.props.fetchRoom(this.props.match.params.roomId, {user_id: this.props.curr_user.id})
    }

  }

  componentDidMount() {
      
      this.props.fetchRoom(this.props.match.params.roomId, {user_id: this.props.curr_user.id})
      .then(()=>
      { 
      const users = {user_ids: this.props.room.users}       
      return this.props.fetchUsers(users)}).then(()=>{

      this.socket = io(config[process.env.NODE_ENV].endpoint);
          
      // Load the last 10 messages in the window.
      
      const roomData={room_id: this.props.room._id,
      user_id: this.props.curr_user.id}
      this.socket.emit('join-room', roomData)
      if(!this.state.chat.length)
      {  
      this.socket.on('init', (msgs) => {
          debugger
          const chatmsgsId = this.state.chat.map(msg => msg._id)
          const filteredmsgs = msgs.filter(message=> message.room_id === this.props.room._id && !chatmsgsId.includes(message._id))
          
          this.setState((state) => ({
            chat: [...state.chat, ...filteredmsgs.reverse()],
            admin: this.props.room.users[0] === this.props.curr_user.id
          }), this.scrollToBottom);
        });
    
      }
    


      // // Update the chat if a new message in this room is broadcasted .
      this.socket.on('disconnect', ()=> {
        this.socket.emit('exit-room', roomData)
      })


      this.socket.on('update-room-info', (roomData)=> {
        debugger
        if (roomData.room_id == this.props.room._id)
        {this.props.fetchRoom(this.props.match.params.roomId)
        .then(()=>
        { 
          const users = {user_ids: this.props.room.users}
          
          return this.props.fetchUsers(users)
          })
        .then(()=>this.setState({admin:this.props.curr_user.id === this.props.room.users[0]}))
        }
      })


      this.socket.on('push', (msg) => {
        debugger
        // if(msg.room_id === this.props.room._id)
      //  { 

            debugger
            this.setState((state) => ({
              chat: [...state.chat, msg],
            }), this.scrollToBottom)
          
        // }
      });
      this.socket.on('modeon', gamemode => {
        debugger
        // if (gamemode.room_id === this.props.room._id){
          console.log('gamemode toggle')
          if (gamemode.mode)
          {this.props.fetchDistribution(this.props.room._id)
          .then(()=> {
            this.setState({roles: this.props.roles, chat:[]})
            const gameroom = document.getElementsByClassName('game-room')[0]
            gameroom.classList.add('game-mode')
          })}
          else {
            this.props.deleteRoles()

              this.setState({roles: {}, chat:[]})
              const gameroom = document.getElementsByClassName('game-room')[0]
              gameroom.classList.remove('game-mode')

          // }
        }
      })

    })

  }

  // Save the message the user is typing in the input field.
  handleContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleRolePlay(e) {
    
    this.setState(
      {game: this.state.game? null : <Theme roomId={this.props.room._id} 
      socket={this.socket} startRoleDistribution={this.props.startRoleDistribution}
      unMountMe={this.handleThemeUnmount}/>}
    )
  }

  handleExit(e) {
    this.socket.emit('exit-room', {room_id: this.props.room._id,
      user_id:this.props.curr_user.id})
    this.props.exitRoom(this.props.room._id, {user_id: this.props.curr_user.id}).then(()=>
    { 
      
      this.props.history.push('/rooms')})
  }

  // When the user is posting a new message.
  handleSubmit(event) {
    // console.log(event);

    // Prevent the form to reload the current page.
    event.preventDefault();
    this.setState((state) => {
      //   console.log(state);
      //   console.log('this', this.socket);
      // Send the new message to the server.
      
      const message = {
        user_id: this.props.curr_user.id,
        content: state.content,
        room_id: this.props.room._id
      }
      debugger
      this.socket.emit('message', message);

      // Update the chat with the user's message and remove the current message.
      return {
        chat: [...state.chat, {
            user_id: this.props.curr_user.id,
            content: state.content,
            room_id: this.props.room._id
        }],
        content: '',
      };
    }, this.scrollToBottom);
  }

  // Always make sure the window is scrolled down to the last message.
  scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }


  messageDisplay(el, index) {
    const mgsClass = this.props.curr_user.id === el.user_id ? 'self-message' : 'other-users-message'
    const imgsrc = this.props.roles[el.user_id] ? `ThemeAvatars/${this.props.roles[el.user_id].theme_id}/${this.props.roles[el.user_id].role_avator_id}.png` :
    this.props.users[el.user_id]? `/avatar${this.props.users[el.user_id].avatarId}.png`: null


    return (<div key={index} className={mgsClass}>
        <div><img src={imgsrc} /></div>
        <div className='text-holder'>
          <div className="name">
          {this.props.roles[el.user_id]? this.props.roles[el.user_id].name:
            this.props.users[el.user_id]? this.props.users[el.user_id].username: el.user_id}
          
          </div>
          <div className="content">
            {el.content}
          </div>
        </div>
      </div>)
  }

  handleThemeUnmount() {
    this.setState({game:null,
    chat:[]})
    const gameroom = document.getElementsByClassName('game-room')[0]
    gameroom.classList.add('game-mode')
  }

  handleExitGame() {
    this.props.deleteRoleDistribution(this.props.room._id).then(
      ()=> {
        this.socket.emit('gamemode', {room_id: this.props.room._id, mode:false})
      this.setState({roles: {}, chat:[]})}
    )
  }

  render() {
  

    return (
      <div className="game-room">
         {/* <img className="main-page-image" src='/gameroom3.jpg' /> */}
         <div className="show-page-background"></div>
         <div className="game-room-container">

        
            <div className="show-page-buttons">
                <div className='exit-gameroom'>
                  <button onClick={this.handleExit}>Exit Room</button>
                </div>
                {this.state.admin?
                <div className="role-play-dropdown">
                  <div className='theme-choose'>
                    <button onClick={this.handleRolePlay}>Role-Play</button>
                  </div>
                  <div className="room-name-bar"> 
                    <p>{this.state.game}</p>
                  </div>
                </div> : null}
            </div>
            <div className='gameroom-title-bar'>{this.props.room.title}
          {Object.keys(this.props.roles).length && this.state.admin ?(
            <button onClick={this.handleExitGame} className="exit-gamemode-button">Exit Game Mode</button>
          ): null }
          </div>
          <div className='chat-box'>
        <Paper id="chat" elevation={3} >
          {this.state.chat.map((el, index) => {
            return this.messageDisplay(el, index)
          })}
        </Paper>
        </div>
        <form onSubmit={this.handleSubmit} className='submit-message-box'>

        <input
          value={this.state.content}
          onChange={this.handleContent}
        />
        <button type='submit' className='submit-button'>Submit</button>
        </form>
        </div>
      </div>
    );
  }
};

export default Room;
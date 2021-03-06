import React, { Component } from 'react'
import RoomIndexItem from './room_index_item';

class RoomIndex extends Component {
  componentDidMount() {
    this.props.fetchRooms('avaliable');
    this.handleChange = this.handleChange.bind(this)
  }

  handleRedirect(roomId) {
    return () => this.props.history.push(`/rooms/${roomId}`)
  }

  handleChange(e) {
      if(e.target.checked) {
        this.props.fetchRooms('all')
      }
      else{
        this.props.fetchRooms('avaliable')
      }
  } 

  render() {
    return (
      <div className='room-index-main'>
        <div className="main-page-background"></div>
        <h1>All Rooms</h1>
        <div className='toggle-rooms'>
          <span className="toggle-switch-text"> Show Rooms in Game</span>
          <label className="switch">
            <input type="checkbox" onChange={this.handleChange}/>
            <span className="slider round"></span>
          </label>
        </div>
        <ul className="rooms-container">         
          {this.props.rooms.map((room) => {
            return <RoomIndexItem handleRedirect={this.handleRedirect.bind(this)}  key={room._id} room={room} />
          })}
        </ul>
      </div>
    )
  }
}

export default RoomIndex
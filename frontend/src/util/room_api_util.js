import axios from 'axios';

export const getRooms = () => {
  return axios.get('/api/rooms')
};


export const createRoom = data => {
  return axios.post('/api/rooms/', data)
}

export const enterRoom = (room_id) => {
    return axios.get(`/api/rooms/${room_id}`)
}
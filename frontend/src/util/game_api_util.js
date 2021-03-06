import axios from 'axios';


export const getThemes = () => {
    
  return axios.get('/api/games/roleplay/')
};


export const getRoles = (theme_id, roomData) => { 

    return axios.post(`/api/games/roleplay/${theme_id}`, roomData)
    
}


export const getDistribution = (room_id) => {
  
    return axios.get(`/api/games/roleplay/${room_id}`)
}


export const deleteDistribution = (room_id) => {
  
  return axios.delete(`api/games/roleplay/${room_id}`)
}



export const createTheme = (themeData) => {
  return axios.post(`api/games/roleplay`, themeData)
}

export const createRole = (theme_id, roleData) => {
  return axios.post(`api/games/roleplay/roles`, roleData) 
}
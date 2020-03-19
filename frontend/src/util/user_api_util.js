import axios from "axios";


export const getUsers = user_ids => {
  return axios.get(`/api/users/`, user_ids);
};

export const getUser = user_id => {
  // debugger
  return axios.get(`/api/users/${user_id}`);
};

export const updateUser = user => {
  // debugger
  return axios.post(`/api/users/${user._id}`, user)
}
//double check ._id or .id


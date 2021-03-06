const mongoose = require("mongoose")
const Schema = mongoose.Schema 
const User = require('./User')

const RoomSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    users: {
        type: Array,
        required: true},
    date: {
        type: Date, 
        default: Date.now
    },
    game: {
        type:String
    }
})

const Room = mongoose.model('Room', RoomSchema)
module.exports = Room
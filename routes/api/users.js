const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys');
const passport = require('passport')


const User = require('../../models/User')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

router.get("/test", (req,res) => {
    // 
    res.json({msg: "this is the user router"})
})

router.get("/:user_ids", (req, res) => {
  // console.log(req.body)
  // const ids = req.body.user_ids
  const ids = req.params.user_ids.split(',')
  // console.log(ids)
  // console.log(typeof ids)
  // console.log(JSON.parse(ids))
  // User.find().where("_id").in(JSON.parse(ids))
  User.find().where("_id").in(ids)
  // User.find({_id: req.body.user_ids})
  .then(users=> res.json(users))
})

router.post('/register', (req, res) => { 
    const { errors, isValid } = validateRegisterInput(req.body);
    
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          // Throw a 400 error if the email address already exists
          return res.status(400).json({email: "A user has already registered with this address"})
        } else {
            // 
          // Otherwise create a new user
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            })
          })
        }
      })
})


  router.post('/login', (req, res) => {
    
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
    return res.status(400).json(errors);
    }
    
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({email})
      .then(user => {
        if (!user) {
          return res.status(404).json({email: 'This user does not exist'});
        }
  
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
                const payload = {id: user.id, username: user.username, avatarId: user.avatarId, email: user.email, date: user.date};

                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  // Tell the key to expire in one hour
                  {expiresIn: 3600},
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    });
                  });
            } else {
              return res.status(400).json({password: 'Incorrect password'});
            }
          })
      })
  })

  router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      });
  })

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
          // console.log(user)
          return res.json(user)})
        .catch(err => console.log(err))
});


// only updating avatarId for now
router.post(`/:id`,(req,res) => {
  // console.log(req.body)
  // User.updateOne({_id:req.params.id}, {"avatarId": req.body.avatarId})
  User.findById(req.params.id)
  .then(user => {
    user.avatarId = req.body.avatarId
    user.whatsUp = req.body.whatsUp
    user.save()
    .then(user => res.json(user))
  })
}
)

module.exports = router

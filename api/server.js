// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

const server = express();
server.use(express.json());

//POST /api/users  Creates a user using the information sent inside the `request body`.
server.post('/api/users', async (req,res) => {
    try{
        if(!req.body.name || !req.body.bio){
            res.status(400).json({
                message: 'Please provide name and bio for the user'
            });
        }else{
            const newUser = await User.insert(req.body);
            res.status(201).json(newUser);
        }
    }catch (err){
        res.status(500).json({message: 'There was an error while saving the user to the database',error: err.message})
    }
})
//| GET    | /api/users     | Returns an array users. 
server.get('/api/users', async (req,res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch (err){
        res.status(500).json({message: 'The users information could not be retrieved'})
    }
})
//| GET    | /api/users/:id | Returns the user object with the specified `id`.
server.get('/api/users/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(404).json({
                message: "The user with the specified ID does not exist" 
            });
        }else{
            res.json(user)
        }
    }catch (err){
        res.status(500).json({message: 'The user information could not be retrieved'})
    }
})
//| DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.   
server.delete('/api/users/:id', async (req, res) =>{
    const {id} = req.params
    User.remove(id).then(deletedUser =>{
        if(!deletedUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            res.json(deletedUser)
        }
    }).catch(err => {
        res.status(500).json({message: 'The user could not be removed', error: err.message})
    })
})
//| PUT| /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |
server.put('/api/users/:id', async (req, res) => {
    const {id} = req.params
    const {body} = req
    try{
        const updated = await User.update(id, body);
        if (!updated){
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        }else if(!req.body.name || !req.body.bio){
            res.status(400).json(
                { message: "Please provide name and bio for the user" }
            );
        }else{
            res.status(200).json(updated);
        }
    }catch (err){
        res.status(500).json({message: 'The user information could not be modified'});
    }
})
module.exports = server; // EXPORT YOUR SERVER instead of {}

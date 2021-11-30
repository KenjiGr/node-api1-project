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
                message: 'name and bio are required'
            });
        }else{
            const newUser = await User.insert(req.body);
            res.status(201).json(newUser);
        }
    }catch (err){
        res.status(500).json({message: 'something wrong',error: err.message})
    }
})
//| GET    | /api/users     | Returns an array users. 
server.get('/api/users', async (req,res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch (err){
        res.status(500).json({message: 'something wrong',error: err.message})
    }
})
//| GET    | /api/users/:id | Returns the user object with the specified `id`.
server.get('/api/users/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.json(user)
    }catch (err){
        res.status(500).json({message: 'something wrong',error: err.message})
    }
})
//| DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.   
server.delete('/api/users/:id', async (req, res) =>{
    const {id} = req.params
    User.remove(id).then(deletedUser =>{
        if(!deletedUser){
            res.status(400).json({
                message: `user by id ${id} does not exist`
            })
        }else{
            res.json(deletedUser)
        }
    }).catch(err => {
        res.status(500).json({message: 'error deleting user', error: err.message})
    })
})
//| PUT| /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |
server.put('/api/users/:id', async (req, res) => {
    const {id} = req.params
    const {body} = req
    try{
        const updated = await User.update(id, body);
        if (!updated){
            res.status(400).json({
                message: `user by id ${id} does not exist`
            })
        }else {
            res.json(updated);
        }
    }catch (err){
        res.status(500).json({message: 'something messed up', error: err.message});
    }
})
module.exports = server; // EXPORT YOUR SERVER instead of {}

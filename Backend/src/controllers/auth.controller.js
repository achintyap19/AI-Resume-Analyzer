const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const blacklistTokenModel = require('../models/blacklist.model')

async function registerUser(req,res){

    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({message:'pls provide username, email and password'})
    }

    const isAlreadyExist = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    if(isAlreadyExist){
        return res.status(400).json({message:'Accound already exists with this email address or username'})
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id, username: user.username
    }, process.env.JWT_SECRET,
    {expiresIn: '1d'}
    )

    res.cookie('token', token)

    return res.status(201).json({
        message: 'user registered successfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}

async function loginUser(req,res) {

    const {email, password} = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({message: 'Invalid email'})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({message: 'Invalid password'})  
    }

    const token = jwt.sign({
        id: user._id, username: user.username
        }, process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )
    res.cookie('token', token)

    return res.status(200).json({
        message: 'user logged-in succcessfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

async function logoutUser(req,res){

    const token = req.cookies.token

    if(token){
        await blacklistTokenModel.create({ token })
    }

    res.clearCookie('token')

    res.status(200).json({
        message: 'User logged-out successfully'
    })
}

async function getMe(req,res){


    const user = await userModel.findById(req.user.id)

    res.status(201).json({
        message: 'User detailed fetched successfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = { 
    registerUser , 
    loginUser , 
    logoutUser,
    getMe
}
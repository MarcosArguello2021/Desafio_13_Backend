import {User} from "../models/user.js"
import passport from '../utils/passport.js'
import mongoose from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

export const signup = async (req, res) => {
    const { email, password } = req.body
    const userFound = await User.findOne({ email: email })
    if (userFound) {
        return res.redirect("/api/error-registro")
    }
    const newUser = new User({ email, password })
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save();
    return res.redirect("/api/login")
};

export const signin = passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/api/error-login",
})

export const logout = async (req, res, next)=> {
    let idSession = req.session.passport.user
    let userInfo = await User.findOne({ '_id': idSession })
    let infoUser = userInfo.email
    await req.logout((err) => {
        if (err) return next(err)
        return res.render("logout", { infoUser })
    })
}
export const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/api/login');
    }
}
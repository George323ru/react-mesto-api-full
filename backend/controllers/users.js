const { NODE_ENV, JWT_SECRET } = process.env
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const NotFoundError = require('../errors/not-found-err')
const BadRequestError = require('../errors/bad-request-err')
const ConflictError = require('../errors/conflict-err')
const AuthError = require('../errors/auth-err')

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(user => {
      res.send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError('Переданы некорректные данные при создании пользователя'))
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Произошла ошибка при создании пользователя'))
      } else {
        next(err)
      }
    })
}

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidID'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError({ message: 'Пользователь по указанному _id не найден' }))
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при запросе _id'))
      } else {
        next(err)
      }
    })
}

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidID'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Пользователь по указанному _id не найден'))
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при запросе _id'))
      } else {
        next(err)
      }
    })
}

const getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send(users))
    .catch(next)
}

const patchUser = (req, res, next) => {
  const { name, about } = req.body

  User.findByIdAndUpdate(req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false })
    .orFail(new Error('NotValidID'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Пользователь по указанному _id не найден'))
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка при изменении данных пользователя'))
      } else {
        next(err)
      }
    })
}

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false })
    .orFail(new Error('NotValidID'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.message === 'NotValidID') {
        next(new NotFoundError('Пользователь по указанному _id не найден'))
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при изменении аватара'))
      } else {
        next(err)
      }
    })
}

const login = (req, res, next) => {
  const { email, password } = req.body

  return User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      )

      // res
      //   .cookie('jwt', token, {
      //     maxAge: 36000,
      //     httpOnly: true,
      //     sameSite: true,
      //   })

      res.send({ token })
    })
    .catch(() => {
      throw new AuthError('Ошибка входа')
    })
    .catch(next)
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
  patchUser,
  patchUserAvatar,
  login,
}
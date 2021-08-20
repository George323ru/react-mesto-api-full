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
        throw new NotFoundError('Переданы некорректные данные при создании пользователя')
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Произошла ошибка при создании пользователя')
      }
    })
    .catch(next)
}

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidID'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.message === 'NotValidID') {
        throw new NotFoundError({ message: 'Пользователь по указанному _id не найден' })
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы2 некорректные данные при запросе _id')
      }
    })
    .catch(next)
}

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidID'))
    .then(user => res.send(user))
    .catch(err => {
      if (err.message === 'NotValidID') {
        throw new NotFoundError('Пользователь по указанному _id не найден')
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при запросе _id')
      }
    })
    .catch(next)
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
        throw new NotFoundError('Пользователь по указанному _id не найден')
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка при изменении данных пользователя')
      }
    })
    .catch(next)
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
        throw new NotFoundError('Пользователь по указанному _id не найден')
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при изменении аватара')
      }
    })
    .catch(next)
}

const login = (req, res, next) => {
  const { email, password } = req.body

  return User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' })

      res
        .cookie('jwt', token, {
          maxAge: 36000,
          httpOnly: true,
          sameSite: true,
        })

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
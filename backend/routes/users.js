const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const {
  getUsers,
  getUser,
  getCurrentUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users.js')

router.get('/', getUsers)
router.get('/me', getCurrentUser)
router.get('/:userId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().length(24).hex(),
    }),
  }), getUser)
router.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }), patchUser)
router.patch('/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required()
        .pattern(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/,
        ),
    }),
  }), patchUserAvatar)

module.exports = router
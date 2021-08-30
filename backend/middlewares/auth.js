const jwt = require('jsonwebtoken')

const AuthError = require('../errors/auth-err')

const { JWT_SECRET = 'secret-key' } = process.env

const auth = (req, res, next) => {
  const { authorization } = req.headers
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизиция')
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    throw new AuthError('Необходима авторизиция')
  }

  req.user = payload // записываем пейлоуд в объект запроса

  next()
}

module.exports = auth
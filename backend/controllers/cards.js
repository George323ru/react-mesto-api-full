const Card = require('../models/card')
const NotFoundError = require('../errors/not-found-err')
const BadRequestError = require('../errors/bad-request-err')
const ForbiddenError = require('../errors/forbidden-err')

const createCard = (req, res, next) => {
  const owner = req.user._id
  Card.create({ owner, ...req.body })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки')
      }
    })
    .catch(next)
}

const getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(next)
}

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if ((card === null) && (card.owner.toString() !== req.user._id)) {
        throw new ForbiddenError('Не хватает прав для удаления карточки')
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then(data => res.send(data))
        .catch(next)
    })
    .catch(() => {
      throw new NotFoundError('Произошла ошибка')
    })
    .catch(next)
}

const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotValidID'))
    .then(card => res.send(card))
    .catch(err => {
      if (err.message === 'NotValidID') {
        throw new NotFoundError('Карточка с указанным _id не найдена')
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при отправке лайка')
      }
    })
    .catch(next)
}

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotValidID'))
    .then(card => res.send(card))
    .catch(err => {
      if (err.message === 'NotValidID') {
        throw new NotFoundError('Карточка с указанным _id не найдена')
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при удалении лайка')
      }
    })
    .catch(next)
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
}
import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({
  link,
  name,
  likes,
  owner,
  cardId,
  onCardClickImg,
  onCardLike,
  onCardDelete,
}) {
  const handleClick = () => {
    onCardClickImg({ link, name });
  };

  const handleLikeClick = () => {
    onCardLike({ cardId, likes });
  };

  const handleDeleteClick = () => {
    onCardDelete({ cardId });
  };

  const currentUserContex = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = owner === currentUserContex._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `element__delete-button ${isOwn ? "element__delete-button_visible" : "element__delete-button_hidden"
    }`;
  console.log(likes)
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = likes.some(i => i._id === currentUserContex._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__likeButton ${isLiked ? "element__likeButton_active" : " "
    }`;

  return (
    <li className='element'>
      <img
        className='element__image'
        src={link}
        alt={name}
        onClick={handleClick}
      />
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
        type='button'
        name='deleteButton'></button>
      <div className='element__name'>
        <h2 className='element__title'>{name}</h2>
        <div className='element__like'>
          <button
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
            type='button'
            name='likeButton'></button>
          <p className='element__likeCount'>{likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;

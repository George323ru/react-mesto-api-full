import React, { useContext } from "react";
import Card from "../components/Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className='main page__container'>
      <section className='profile'>
        <div className='profile__user-info'>
          <div className='profile__wrapAvatar'>
            <img
              className='profile__avatar'
              src={currentUser.avatar}
              alt='Аватар пользователя'
            />
            <button
              className='profile__editAvatarButton'
              type='button'
              name='editAvatarButton'
              onClick={onEditAvatar}
            />
          </div>
          <div className='profile__user-details'>
            <div className='profile__user-description'>
              <h1 className='profile__userName'>{currentUser.name}</h1>
              <p className='profile__userJob'>{currentUser.about}</p>
            </div>
            <button
              className='profile__editBtn'
              type='button'
              name='editButton'
              onClick={onEditProfile}
            />
          </div>
        </div>
        <button
          className='profile__add-button'
          type='button'
          name='addButton'
          onClick={onAddPlace}
        />
      </section>

      <section className='elements'>
        <ul className='elements__element-list'>
          {cards.map(({ _id, ...card }) => (
            <Card
              key={_id}
              {...card}
              cardId={_id}
              onCardClickImg={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;

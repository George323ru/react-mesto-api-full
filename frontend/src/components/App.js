import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import React, { useState, useEffect } from "react";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  // Стейт используется для открытия попапа с картинкой
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCards()])
      .then(([userInfo, cardData]) => {
        setCurrentUser(userInfo);
        setCards(cardData);
      })
      .catch((err) => console.log("Ошибка при получении данных, " + err));
  }, []);

  const handleCardLike = ({ cardId, likes }) => {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(cardId, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === cardId ? newCard : c)));
      })
      .catch((err) =>
        console.log("Ошибка при получении данных о лайке, " + err)
      );
  };

  const handleCardDelete = ({ cardId }) => {
    api
      .deleteCard(cardId)
      .then((cardDelete) => {
        setCards((state) => state.filter((a) => a._id !== cardId));
      })
      .catch((err) =>
        console.log("Ошибка при получении данных о карточке, " + err)
      );
  };

  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };

  const handleCardClick = (data) => {
    setSelectedCard(data);
  };

  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(null);
  };

  const handleUpdateUser = ({ name, description }) => {
    api
      .patchSaveUserData(name, description)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) =>
        console.log("Ошибка при отправке новых данных о пользователе, " + err)
      );
  };

  const handleUpdateAvatar = ({ avatar }) => {
    api
      .patchUpdateUserAvatar(avatar)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) =>
        console.log("Ошибка при отправке новых данных об аватаре, " + err)
      );
  };

  const handleAddCard = ({ name, link }) => {
    api
      .postAddNewCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) =>
        console.log("Ошибка при отправке данных о новой карточке, " + err)
      );
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='body'>
        <div className='page'>
          <Header />
          <Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCard}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup name='img' onClose={closeAllPopups} card={selectedCard} />
          <Footer />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

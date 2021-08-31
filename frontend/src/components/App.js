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
import InfoTooltip from "./InfoTooltip";
import Register from "./Register";
import Login from "./Login";
import * as auth from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute";
import { Route, Switch, useHistory } from "react-router-dom";

const App = () => {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  // Стейт используется для открытия попапа с картинкой
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    email: "",
  });
  const [register, setRegister] = useState(false);
  const history = useHistory();

  const handleError = () => (err) => console.error(err);

  // Проверяем токен при загрузке страницы
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          const { data } = res;

          setUserData({
            id: data._id,
            email: data.email,
          });
          setLoggedIn(true);
          history.push("/");
        })
        .catch(handleError);
    } else {
      setLoggedIn(false);
      console.log('Пустой токен');
    }
  };

  const handleLogin = ({ email, password }) => {
    auth
      .authorize(email, password)
      .then((data) => {
        setUserData({
          ...userData,
          email: email,
        });
        if (data) {
          localStorage.setItem("jwt", data.token);
        }
        setLoggedIn(true);
        history.push("/");
      })
      .catch(handleError);
  };

  const handleRegister = ({ email, password }) => {
    auth
      .register(email, password)
      .then((res) => {
        console.log(res)
        const { email, _id } = res;
        setUserData({
          id: _id,
          email: email,
        });
        setRegister(true);
        setInfoTooltipOpen(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        handleError(err);
        setInfoTooltipOpen(true);
      });
  };

  const handleLogOut = () => {
    setUserData({
      id: "",
      email: "",
    });
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push("/sign-in");
  };

  // Получаем данные о пользователе и карточках
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([userInfo, cardData]) => {
          console.log(userInfo);
          setCurrentUser(userInfo);
          setCards(cardData);
        })
        .catch((err) => console.log("Ошибка при получении данных, " + err));
    }
  }, [loggedIn]);

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
    setInfoTooltipOpen(false);
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

  // if (loggedIn === undefined) {
  //   return <div>Loading</div>;
  // }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='body'>
        <div className='page'>
          <Header
            loggedIn={loggedIn}
            handleLogOut={handleLogOut}
            userData={userData}
            register={register}
          />
          <Switch>
            <ProtectedRoute
              exact
              path='/'
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />

            <Route path='/sign-in'>
              <Login handleLogin={handleLogin} />
            </Route>
            <Route path='/sign-up'>
              <Register handleRegister={handleRegister} />
            </Route>
          </Switch>

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
          <ImagePopup onClose={closeAllPopups} card={selectedCard} />

          <InfoTooltip
            register={register}
            setReg={setRegister}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
          />
          <Footer />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;

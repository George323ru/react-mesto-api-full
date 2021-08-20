import PopupWithForm from "./PopupWithForm";
import React, { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Получаем данные из контекста
  const currentUser = useContext(CurrentUserContext);

  // Подставляем полученные данные в поля ввода
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      description,
    });
  };

  return (
    <PopupWithForm
      name='profile'
      title='Редактировать профиль'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>
      <input
        className='popup__input popup__input_type_profileName'
        type='text'
        name='popupProfileInputTypeName'
        value={name || ""}
        onChange={handleChangeName}
        required
        placeholder='Имя'
        minLength={2}
        maxLength={40}
      />
      <span
        className='popup__input-error'
        id='popupProfileInputTypeName-error'
      />
      <input
        className='popup__input popup__input_type_profileJob'
        type='text'
        name='popupProfileInputTypeJob'
        value={description || ""}
        onChange={handleChangeDescription}
        required
        placeholder='О себе'
        minLength={2}
        maxLength={200}
      />
      <span
        className='popup__input-error popup__form-error'
        id='popupProfileInputTypeJob-error'
      />
    </PopupWithForm>
  );
}

export default EditProfilePopup;

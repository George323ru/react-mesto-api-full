import PopupWithForm from "./PopupWithForm";
import React, { useState, useEffect } from "react";

function AddPlacePopup({ isOpen, onClose, onAddCard }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeLink = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddCard({
      name,
      link,
    });
  };

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      name='newPlace'
      title='Новое место'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>
      <input
        className='popup__input'
        type='text'
        name='popupNewPlaceInputTypeName'
        onChange={handleChangeName}
        required
        value={name || ""}
        placeholder='Название'
        minLength={2}
        maxLength={30}
      />
      <span
        className='popup__input-error'
        id='popupNewPlaceInputTypeName-error'
      />
      <input
        className='popup__input'
        type='url'
        name='popupNewPlaceInputTypeLink'
        value={link || ""}
        onChange={handleChangeLink}
        required
        placeholder='Ссылка на картинку'
      />
      <span
        className='popup__input-error'
        id='popupNewPlaceInputTypeLink-error'
      />
    </PopupWithForm>
  );
}

export default AddPlacePopup;

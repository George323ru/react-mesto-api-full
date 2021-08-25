import PopupWithForm from "./PopupWithForm";
import React, { useRef, useEffect } from "react";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

  const avatarRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value
    });

  }

  useEffect(() => {
    avatarRef.current.value = '';
  }, [isOpen]);


  return (
    <PopupWithForm
      name='changeAvatar'
      title='Обновить аватар'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>
      <input
        className='popup__input popup__input_type_changeAvatarTypeLink'
        type='url'
        name='popupChangeAvatarInputTypeLink'
        required
        placeholder='Ссылка на новый аватар'
        ref={avatarRef}
      />
      <span
        className='popup__input-error'
        id='popupChangeAvatarInputTypeLink-error'
      />
    </PopupWithForm>
  )
}

export default EditAvatarPopup
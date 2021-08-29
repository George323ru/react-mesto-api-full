import React from "react";
import popupInfoSuccess from '../images/popupInfoOk.svg';
import popupInfoError from '../images/popupInfoError.svg';

const InfoTooltip = ({ isOpen, onClose, register }) => {
  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className='popup__container'>
        <div className='popup__info-tooltip'>
          <img

            src={`${register ? popupInfoSuccess : popupInfoError}`}
            alt={`${register ? 'popup Info Success' : "popup Info Error"}`}
          />
          <h2 className='popup__title popup__title_text-align_center popup__title_margin_top'>{`${register ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}`}</h2>
          <button
            onClick={onClose}
            className='popup__closeButton'
          />
        </div>
      </div>
    </div>
  )
}

export default InfoTooltip
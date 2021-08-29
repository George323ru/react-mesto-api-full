const ImagePopup = ({ onClose, card }) => {
  return (
    <div className={`popup ${card ? "popup_opened" : ""}`}>
      <div className='popup__wrapPic'>
        <img
          className='popup__picture'
          src={card?.link}
          alt={card?.name}
        />
        <p className='popup__placeName'>
          {card ? card.name : ""}
        </p>
        <button
          onClick={onClose}
          className='popup__closeButton'
        />
      </div>
    </div>
  );
}

export default ImagePopup;

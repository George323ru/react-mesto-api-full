function ImagePopup({ name, onClose, card }) {
  return (
    <div className={`popup popup_type_${name} ${card ? "popup_opened" : ""}`}>
      <div className='popup__wrapPic'>
        <img
          className={`popup__picture popup__picture_type_${name}`}
          src={card ? card.link : ""}
          alt={card ? card.name : ""}
        />
        <p className={`popup__placeName popup__placeName_type_${name}`}>
          {card ? card.name : ""}
        </p>
        <button
          onClick={onClose}
          className={`popup__closeButton popup__closeButton_type_${name}`}
        />
      </div>
    </div>
  );
}

export default ImagePopup;

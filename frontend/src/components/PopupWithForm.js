function PopupWithForm({ title, name, children, isOpen, onClose, onSubmit }) {
  return (
    <div className='PopupWithForm'>
      <div className={`popup popup_type_${name} ${isOpen && "popup_opened"}`}>
        <div className='popup__container'>
          <form
            className={`popup__form popup__form_${name}`}
            action='#'
            name={`${name}`}
            onSubmit={onSubmit}>
            <h2 className='popup__title'>{title}</h2>
            {children}
            <button className='popup__saveBtn' type='submit' name='saveButton'>
              Сохранить
            </button>
          </form>
          <button
            onClick={onClose}
            className={`popup__closeButton popup__closeButton_${name}`}
            type='button'
            name='closeButton'
          />
        </div>
      </div>
    </div>
  );
}

export default PopupWithForm;

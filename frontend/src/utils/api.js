class Api {
  constructor({ address, token }) {
    this.address = address;
  }

  _checkingResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  getCards() {
    return fetch(`${this.address}/cards`, {
      headers: {
      },
    }).then(this._checkingResponse);
  }

  getUserInfo() {
    return fetch(`${this.address}/users/me`, {
      headers: {
      },
    }).then(this._checkingResponse);
  }

  patchSaveUserData(name, job) {
    return fetch(`${this.address}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        about: job,
      }),
    }).then(this._checkingResponse);
  }

  postAddNewCard(name, link) {
    return fetch(`${this.address}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._checkingResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this.address}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(this._checkingResponse);
  }

  putLike(cardId) {
    return fetch(`${this.address}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(this._checkingResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this.address}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(this._checkingResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.putLike(cardId);
    } else {
      return this.deleteLike(cardId);
    }
  }

  patchUpdateUserAvatar(acceptAvatar) {
    return fetch(`${this.address}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: acceptAvatar,
      }),
    }).then(this._checkingResponse);
  }
}

const api = new Api({
  address: "https://gusevgeorgy.students.nomoredomains.club",
});

export default api;

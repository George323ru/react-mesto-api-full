class Api {
  constructor({ address, token }) {
    this.address = address;
    this._token = token;
  }

  _checkingResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  setItemToken(token) {
    this._token = token
  }

  removeItemToken() {
    this._token = ""
  }

  getCards() {
    return fetch(`${this.address}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._token}`,
      },
    }).then(this._checkingResponse);
  }

  getUserInfo() {
    return fetch(`${this.address}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._token}`
      },
    }).then(this._checkingResponse);
  }

  patchSaveUserData(name, job) {
    return fetch(`${this.address}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._token}`,
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
        "Authorization": `Bearer ${this._token}`,
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
        "Authorization": `Bearer ${this._token}`,
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

  putLike(cardId) {
    console.log(cardId)
    return fetch(`${this.address}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._token}`,
      },
    }).then(this._checkingResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this.address}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._token}`,
      },
    }).then(this._checkingResponse);
  }

  patchUpdateUserAvatar(acceptAvatar) {
    return fetch(`${this.address}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        avatar: acceptAvatar,
      }),
    }).then(this._checkingResponse);
  }
}

const api = new Api({
  address: "https://api.gusevgeorgiy.students.nomoredomains.monster",
  token: ""
});

export default api;

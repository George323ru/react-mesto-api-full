import React, { useState } from "react";

const Login = ({ handleLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    handleLogin({ email, password });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  return (
    <div className='authorization'>
      <form className='authorization__form' onSubmit={handleSubmit}>
        <h3 className='authorization__title'>Вход</h3>
        <input
          type='email'
          required
          minLength='2'
          maxLength='200'
          name='email'
          value={loginData.email}
          onChange={handleChange}
          className='authorization__input'
          placeholder='E-mail'
        />
        <input
          type='password'
          required
          minLength='2'
          maxLength='200'
          name='password'
          value={loginData.password}
          onChange={handleChange}
          className='authorization__input'
          placeholder='Пароль'
        />
        <button className='authorization__button' type='submit'>
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;

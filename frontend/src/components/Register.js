import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ handleRegister }) => {
  const [registerData, setRegisterData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = registerData;

    handleRegister({ email, password });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  return (
    <div className='authorization'>
      <form className='authorization__form' onSubmit={handleSubmit}>
        <h3 className='authorization__title'>Регистрация</h3>
        <input
          type='email'
          required
          minLength='2'
          maxLength='200'
          name='email'
          value={registerData.email}
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
          value={registerData.password}
          onChange={handleChange}
          className='authorization__input'
          placeholder='Пароль'
        />
        <button className='authorization__button' type='submit'>
          Зарегистрироваться
        </button>
        <p className='authorization__suggest'>
          Уже зарегистрированы?
          <Link className='authorization__link' to='/sign-in'>
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/mesto-logo.svg";

const Header = ({ loggedIn, handleLogOut, userData }) => {
  const [clickMenuBurger, setClickMenuBurger] = useState(false);

  const { pathname } = useLocation();
  const pathLink = `${pathname === "/sign-in" ? "/sign-up" : "/sign-in"}`;
  const textLink = `${pathname === "/sign-in" ? "Регистрация" : "Войти"}`;

  const handleLinkLogout = () => {
    handleLogOut();
  };

  const handleClickMenuBurger = () => {
    if (clickMenuBurger) {
      setClickMenuBurger(false);
    } else {
      setClickMenuBurger(true);
    }
  };

  return (
    <header className='header section section_size_small page__container'>
      <div className='header__wrap-img-burger'>
        <img className='header__logo' src={logo} alt='Логотип Место' />
        <div className='header__burger-button'>
          <input id='header__menu-toggle' type='checkbox' />
          <label
            onClick={handleClickMenuBurger}
            className='header__menu-btn'
            htmlFor='header__menu-toggle'>
            <span></span>
          </label>
        </div>
      </div>

      <div
        className={`header__wrap-link ${
          clickMenuBurger && "header__wrap-link_active"
        }`}>
        <p className={`header__login ${!loggedIn && "header__login_hidden"}`}>
          {userData.email}
        </p>
        <Link className='header__link' to={`${!loggedIn ? pathLink : ""}`}>
          {`${!loggedIn ? textLink : ""}`}
        </Link>
        <Link
          to='/sign-in'
          className={`header__link header__link_color_grey ${
            !loggedIn && "header__link_hidden"
          }`}
          onClick={handleLinkLogout}>
          Выйти
        </Link>
      </div>
    </header>
  );
};

export default Header;

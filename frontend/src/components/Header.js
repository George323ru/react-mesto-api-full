import logo from "../images/mesto-logo.svg";

function Header() {
  return (
    <div className='header section section_size_small page__container'>
      <img className='header__logo' src={logo} alt='Логотип Место' />
    </div>
  );
}

export default Header;

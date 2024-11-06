import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PopupWithForm from "../PopupWithForm/PopupWithForm";
import SignUpModal from "../SignUpModal/SignUpModal";
import NewsExplorerLogo from "../../assets/NewsExplorer.svg";
import MenuIcon from "../../assets/menu.svg";
import CloseIcon from "../../assets/close.svg";
import "./Header.css";

function Header() {
  const [isSignInPopupOpen, setIsSignInPopupOpen] = useState(false);
  const [isSignUpPopupOpen, setIsSignUpPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const location = useLocation();

  const handleSignInPopupOpen = () => {
    setIsSignInPopupOpen(true);
    setIsSignUpPopupOpen(false);
    setIsMenuOpen(false);
  };

  const handleSignUpPopupOpen = () => {
    setIsSignUpPopupOpen(true);
    setIsSignInPopupOpen(false);
    setIsMenuOpen(false);
  };

  const handlePopupClose = () => {
    setIsSignInPopupOpen(false);
    setIsSignUpPopupOpen(false);
    setIsMenuOpen(false);
    setEmailError("");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        handlePopupClose();
      }
    };

    if (isSignInPopupOpen || isSignUpPopupOpen || isMenuOpen) {
      window.addEventListener("keydown", handleEscClose);
    }

    return () => {
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [isSignInPopupOpen, isSignUpPopupOpen, isMenuOpen]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup_open")) {
      handlePopupClose();
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setEmailError("Invalid email address");
      setIsFormValid(false);
    } else {
      setEmailError("");
      setIsFormValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsSignedIn(true);
      handlePopupClose();
    }
  };

  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          <img
            src={NewsExplorerLogo}
            alt="News Explorer logo"
            className="header__logo-img"
          />
        </Link>

        {/* Menu icon */}
        <img
          src={MenuIcon}
          alt="Menu icon"
          className="header__menu-icon"
          onClick={handleMenuToggle}
        />

        <ul
          className={`header__menu ${isMenuOpen ? "header__menu--open" : ""}`}
        >
          <li className="header__item">
            <Link
              to="/"
              className={`header__link ${
                location.pathname === "/" ? "header__link--active" : ""
              }`}
              onClick={handleMenuToggle}
            >
              Home
            </Link>
          </li>

          <li className="header__item">
            {isSignedIn ? (
              <Link
                to="/saved-news"
                className="header__login-button header__login-button--saved-articles"
              >
                Saved Articles
              </Link>
            ) : (
              <button
                onClick={handleSignInPopupOpen}
                className="header__login-button header__login-button--sign-in"
              >
                Sign in
              </button>
            )}
          </li>
        </ul>

        {isMenuOpen && (
          <div className="header__menu-overlay">
            <img
              src={CloseIcon}
              alt="Close icon"
              className="header__menu-close"
              onClick={handleMenuToggle}
            />
            <ul className="header__menu">
              <li className="header__item">
                <Link
                  to="/"
                  className="header__link"
                  onClick={handleMenuToggle}
                >
                  Home
                </Link>
              </li>

              <li className="header__item">
                {isSignedIn ? (
                  <Link
                    to="/saved-articles"
                    className="header__login-button header__login-button--saved-articles"
                    onClick={handleMenuToggle}
                  >
                    Saved Articles
                  </Link>
                ) : (
                  <button
                    onClick={handleSignInPopupOpen}
                    className="header__login-button header__login-button--sign-in"
                  >
                    Sign in
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
      <div className="header__horizontal-line"></div>

      <PopupWithForm
        isOpen={isSignInPopupOpen}
        onClose={handlePopupClose}
        onOverlayClick={handleOverlayClick}
        title="Sign in"
        onSubmit={handleSubmit}
      >
        <div className="popup__input-container">
          <label htmlFor="signin-email" className="popup__label">
            Email
          </label>
          <input
            type="email"
            id="signin-email"
            placeholder="Enter email"
            required
            className="popup__input"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <span className="popup__error">{emailError}</span>}
        </div>

        <div className="popup__input-container">
          <label htmlFor="signin-password" className="popup__label">
            Password
          </label>
          <input
            type="password"
            id="signin-password"
            placeholder="Enter password"
            required
            className="popup__input"
          />
        </div>

        <button type="submit" className="popup__submit" disabled={!isFormValid}>
          Sign In
        </button>

        <div className="popup__separator">
          or{" "}
          <a href="#" className="popup__link" onClick={handleSignUpPopupOpen}>
            Sign up
          </a>
        </div>
      </PopupWithForm>

      <SignUpModal
        isOpen={isSignUpPopupOpen}
        onClose={handlePopupClose}
        onOverlayClick={handleOverlayClick}
        onSubmit={(data) => {
          console.log("Sign up form submitted:", data);
          handlePopupClose();
        }}
        onSignIn={handleSignInPopupOpen}
      />
    </header>
  );
}

export default Header;

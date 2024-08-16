// src/components/Captcha.js
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import '../../assets/css/captcha.css';

const Captcha = forwardRef(({ captcha, setCaptcha }, ref) =>{
  const captchaInputRef = useRef();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  useImperativeHandle(ref, () => ({
    validate() {
      const user_captcha = captchaInputRef.current.value;
      return validateCaptcha(user_captcha);
    },
    reset() {
      loadCaptchaEnginge(6);
      captchaInputRef.current.value = "";
    }
  }));

  const reloadCaptcha = (event) => {
    event.preventDefault(); // Prevent default form submission
    loadCaptchaEnginge(6);
  };


  const handleInputChange = (event) => {
    console.log(event);
    if (captcha) {
      setCaptcha("");
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="col mt-3 captcha-container">
          <LoadCanvasTemplateNoReload />
          <button onClick={reloadCaptcha} className="btn btn-link reload-button">
            <FontAwesomeIcon icon={faSyncAlt} style={{height:"25px"}} />
          </button>
        </div>
        <div className="wrap-input100 validate-input">
          <input
            className='input100 form-control'
            placeholder="Enter Captcha Value"
            ref={captchaInputRef}
            name="user_captcha_input"
            type="text"
              size="30"
              onChange={handleInputChange}
          />
          <span className="focus-input100"></span>
          <span className="symbol-input100">
            <i className="zmdi zmdi-edit" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>
  );
});

export default Captcha;

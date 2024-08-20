import React, { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link,  useNavigate } from "react-router-dom";
import axios from "axios";
import MsgAlert from "./MsgAlert";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
export default function Register() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });
  const [formData, setFormData] = useState({
    about: "",
    email: "",
    name: "",
    password: "",
    confpass:""
  });
  const [errorMsg, set_errorMsg] = useState({ pass: "" });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name==="confpass"){
        set_errorMsg({...errorMsg, pass:""})
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.confpass !== formData.password) {
      set_errorMsg({
        ...errorMsg,
        pass: "The passwords you entered do not match. Please try again.",
      });
      return;
    }
    const {confpass, ...obj}=formData
    let regObj = {
      ...obj,
    };
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/api/v1/auth/register",
        regObj
      )
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          navigate(process.env.PUBLIC_URL + "/");
        } else {
          setMsg("Already Registered");
          setMsgTyp("AE");
      
        }
       
      });
  };

  const msgRef = useRef(null);
  const [viewMsg, set_viewMsg] = useState(false);
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false);
  }, [viewMsg]);

  const [visblePass, setvisblePass] = useState({pass:false, confPass:false});
  const handlePassVisble = () => {
    setvisblePass({...visblePass, pass:!visblePass.pass}); // Additional actions on captcha success
  };
  const handleConfPassVisble = () => {
    setvisblePass({...visblePass, confPass:!visblePass.confPass}); // Additional actions on captcha success
  };



  return (
    <div className="login-img">
      <div className="page">
     
        <div
          className=""
          onClick={() => custompagesswitcherdata.Swichermainrightremove()}
        >
          <div className="col-log-6 col-login">
            <div className="text-center">
              <img
                style={{ height: "5rem" }}
                src={require("../../assets/images/brand/govt2.png")}
                className="header-brand-img"
                alt=""
              />
            </div>
          </div>
          <div className="container-login100">
            <div className="wrap-login100 p-0">
              <Card.Body style={{width:"392px"}}>
              <span className="login100-form-title">Registration</span>

                <form
                  onSubmit={handleRegister}
                >
                 
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100 form-control"
                      type="text"
                      name="name"
                      size={30}
                      placeholder="User name"
                      onChange={handleInputChange}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="mdi mdi-account" aria-hidden="true"></i>
                    </span>
                  </div>
                

                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100 form-control"
                      type="email"
                      name="email"
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-email" aria-hidden="true"></i>
                    </span>
                  </div>

                  <div className="wrap-input100 validate-input input-group">
                    <input
                      className="input100 form-control"
                      type={visblePass.pass ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      onChange={handleInputChange}
                      size={30}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                    <span className="input-group-text"
                    onClick={handlePassVisble}
                    >
                      <FontAwesomeIcon
                        icon={visblePass.pass ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>

                  <div className="wrap-input100 validate-input input-group">
                    <input
                      className="input100 form-control"
                      type={visblePass.confPass ? "text" : "password"}
                      name="confpass"
                      placeholder="Confirm Password"
                      onChange={handleInputChange}
                      size={30}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                    <span className="input-group-text"
                    onClick={handleConfPassVisble}
                    >
                      <FontAwesomeIcon
                        icon={visblePass.confPass ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>

                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100 form-control"
                      type="text"
                      name="about"
                      onChange={handleInputChange}
                      size={30}
                      placeholder="Prupose"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i
                        className="zmdi zmdi-account-box"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                  {errorMsg.pass ? (
                        <div className="text-red text-center">{errorMsg.pass}</div>
                      ) : (
                        ""
                      )}
                  <div className="container-login100-form-btn">
                    <button
                      type="submit"
                      className="login100-form-btn btn-primary"
                    >
                      Register
                    </button>
                  </div>
                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Already have an account?
                      <Link
                        to={`${process.env.PUBLIC_URL}/`}
                        className="text-primary ms-1"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                  {msg && (
                    <div ref={msgRef}>
                      {" "}
                      <MsgAlert
                        errExp={errExp}
                        msg={msg}
                        msgTyp={msgTyp}
                      />{" "}
                    </div>
                  )}
                </form>
              </Card.Body>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Tabs, Tab } from "react-bootstrap";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  getScplAdContext,
  removeApiToken,
  setApiToken,
  getApiToken,
} from "./common";
import { setScplAdContext } from "./common";
import { removeScplAdContext } from "./common";
import ReplayIcon from "@mui/icons-material/Replay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MsgAlert from "./MsgAlert";
import Countdown from "react-countdown";
import Captcha from "./Capcha";
import { Helmet } from "react-helmet";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
//import {isAutenticated} from "./common"
let chngLogNo = "";
export default function Login() {
  removeScplAdContext();
  removeApiToken();
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ipAddress: "0",
    username: "",
    password: "",
  });

  const [visblePass, setvisblePass] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const [errorMsg, set_errorMsg] = useState({ VldtMsg: "", capchaMsg: "" });
  const [captcha, setCaptcha] = useState();

  // For Mobile Otp Login Code End...............................

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  const getUser = async (name) => {
    const token = getApiToken(); // Assuming getApiToken() returns your token

    return await axios.get(
      process.env.REACT_APP_API_URL_PREFIX + `/api/v1/auth/current-user/`,
      {
        params: { name },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaRef.current.validate()) {
      let obj = {
        username: formData.username,
        password: formData.password,
      };

      let url = process.env.REACT_APP_API_URL_PREFIX + "/api/v1/auth/login";
      await axios
        .post(url, obj)
        .then((response) => {
          if (response.data.code === 0) {
            setScplAdContext(response.data);
            setApiToken(response.data.token);
            sessionStorage.setItem(
              "sideBarAccess",
              response.data.user.roles[0].id
            );
            let rolename = response.data.user.email;
            getUser(rolename).then((res) => {
              let role = res.data.roles[0]?.id;
              role === 501
                ? navigate(process.env.PUBLIC_URL + "/GetAllUser")
                : navigate(process.env.PUBLIC_URL + "/GetAllData");
            });
          }
        })
        .catch((error) => {
          setLoginMsg(
            error.response.data.message ||
              "An error occurred. Please try again."
          );
        });
    } else {
      // alert('Captcha validation failed. Please try again.');
      setCaptcha("Captcha validation failed. Please try again.");
      captchaRef.current.reset();
    }
  };
  console.log(loginMsg);

  const handlePassVisble = () => {
    setvisblePass(!visblePass); // Additional actions on captcha success
  };

  return (
    <div className="login-img">
      <div className="page">
        <Helmet>
          <title>
            Janma Mrityutathya - In-depth Insights on Life and Death
          </title>
          <meta
            name="description"
            content="Explore comprehensive insights on Janma-Mrityutathya, covering life and death concepts in detail."
          />
          <meta
            name="keywords"
            content="janma mrityutathya, life and death, birth and death facts"
          />
        </Helmet>
        {/* <div className="dropdown float-end custom-layout">
          <div
            className="demo-icon nav-link icon mt-4 bg-warning"
            onClick={() => custompagesswitcherdata.Swichermainright()}
          >
            <i className="fe fe-settings fa-spin text_primary"></i>
          </div>
        </div> */}
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
                <span className="login100-form-title">User Login</span>
                <form onSubmit={handleSubmit}>
                  {/* <div className="tab-pane active show" id="tab20"> */}
                  <div className="wrap-input100 validate-input">
                    <input
                      required
                      className="input100 form-control"
                      type="email"
                      name="username"
                      id="userId"
                      placeholder="Enter Email ID"
                      autocomplete="off"
                      size="30"
                      //maxlength="25"
                      path="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-account" aria-hidden="true"></i>
                    </span>
                  </div>
                  <div className="wrap-input100 validate-input input-group">
                    <input
                      required
                      className="input100 form-control"
                      // style={errorMsgUserId?{borderColor:"red"}:{borderColor:" #ecf0fa"}}
                      type={visblePass ? "text" : "password"}
                      name="password"
                      id="userPassword"
                      placeholder="Enter Password"
                      //autocomplete="off"
                      size="30"
                      //maxlength="25"
                      path="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                    <span className="input-group-text"
                    onClick={handlePassVisble}
                    >
                      <FontAwesomeIcon
                        icon={visblePass ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>
                  <Captcha
                    ref={captchaRef}
                    captcha={captcha}
                    setCaptcha={setCaptcha}
                  />
                  <div className="text-red">{captcha}</div>
                  <div className="text-end pt-1">
                    <p className="mb-0">
                      <Link
                        to={`${process.env.PUBLIC_URL}/ForgotPass/`}
                        className="text-primary ms-1"
                      >
                        Forgot Password?
                      </Link>
                    </p>
                  </div>
                  <div className="container-login100-form-btn">
                    <button
                      type="submit"
                      className="login100-form-btn btn-primary"
                    >
                      Login
                    </button>
                  </div>
                  {/* </div> */}
                </form>
                <div className="text-center text-red pt-3">{loginMsg}</div>
                <div className="text-center pt-3">
                  <p className="text-dark mb-0">
                    Dont't have an account?
                    <Link
                      to={`${process.env.PUBLIC_URL}/register`}
                      className="text-primary ms-1"
                    >
                      Register Now
                    </Link>
                  </p>
                </div>
              </Card.Body>
              {/* 
              <Card.Footer>
                <div className="d-flex justify-content-center my-3">
                  <Link to="#" className="social-login  text-center me-4">
                    <i className="fa fa-google"></i>
                  </Link>
                  <Link to="#" className="social-login  text-center me-4">
                    <i className="fa fa-facebook"></i>
                  </Link>
                  <Link to="#" className="social-login  text-center">
                    <i className="fa fa-twitter"></i>
                  </Link>
                </div>
              </Card.Footer> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeApiToken, setApiToken } from "./common";
import { setScplAdContext } from "./common";
import MsgAlert from "./MsgAlert";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata";
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
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let regObj = {
      ...formData,
    };
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + "/api/v1/auth/register",
        regObj
      )
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          navigate(process.env.PUBLIC_URL + "/CMF00000/login");
        } else {
          setMsg("Already Registered");
          setMsgTyp("AE");
          // set_errExp()
        }
        // setData(res?.data?.content);
        // console.log(data);
      });
  };

  const msgRef = useRef(null);
  const [viewMsg, set_viewMsg] = useState(false);
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false);
  }, [viewMsg]);

  return (
    <div className="login-img">
      <div className="page">
        <div className="dropdown float-end custom-layout">
          <div
            className="demo-icon nav-link icon mt-4 bg-warning"
            onClick={() => custompagesswitcherdata.Swichermainright()}
          >
            <i className="fe fe-settings fa-spin text_primary"></i>
          </div>
        </div>
        <div
          className=""
          onClick={() => custompagesswitcherdata.Swichermainrightremove()}
        >
          <div className="col col-login mx-auto">
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
              <Card.Body>
                <form
                  className="login100-form validate-form"
                  onSubmit={handleRegister}
                >
                  <span className="login100-form-title">Registration</span>
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100"
                      type="text"
                      name="name"
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
                      className="input100"
                      type="text"
                      name="password"
                      placeholder="Password"
                      onChange={handleInputChange}
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                    </span>
                  </div>

                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100"
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

                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100"
                      type="text"
                      name="about"
                      onChange={handleInputChange}
                      placeholder="About"
                    />
                    <span className="focus-input100"></span>
                    <span className="symbol-input100">
                      <i
                        className="zmdi zmdi-account-box"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>

                  <div className="container-login100-form-btn">
                    <button
                      type="submit"
                      //   to={`${process.env.PUBLIC_URL}/dashboard/`}
                      className="login100-form-btn btn-primary"
                    >
                      Register
                    </button>
                  </div>
                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Already have an account?
                      <Link
                        to={`${process.env.PUBLIC_URL}/CMF00000/login`}
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
              {/* <Card.Footer>
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

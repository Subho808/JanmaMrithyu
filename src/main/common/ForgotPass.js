import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form } from "react-bootstrap";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import {
  Tabs,
  Tab,
  OverlayTrigger,
  Tooltip,
  Breadcrumb,
  Button,
} from "react-bootstrap";
// import * as formelement from "../../data/Form/formelement/formelement";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as custompagesswitcherdata from "../../data/Switcher/Custompagesswitcherdata";
let chngLogNo = "";
export default function ForgotPass() {
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });
  const [mode, setMode] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    token: "",
  });

  const buttonTitle = () => {
    // Dynamically determine button title based on case state
    switch (caseState) {
      case 0:
        return "Proceed";
      case 1:
        return "Generate OTP";
      case 2:
        return "Validate OTP";
      case 3:
        return "Submit";
      default:
        return "Unknown";
    }
  };

  const [caseState, set_caseState] = useState(0);
  const [msgCase, set_msgCase] = useState(0);

  const [errorMsg, set_errorMsg] = useState({ chngPass: "", pass: "" , token:""});

  //handle the value of input field when changes happen
  const handleInputChange = (event) => {
    console.log(event.target.name, event.target.value);

    const { name, value } = event.target;
    if(name==="confpass"){
        set_errorMsg({...errorMsg, pass:""})
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (formData.confpass !== formData.newPassword) {
      set_errorMsg({
        ...errorMsg,
        pass: "Password not match",
      });
      return;
    }

    if (mode === 1) {
      let url = `${
        process.env.REACT_APP_API_URL_PREFIX
      }/api/v1/auth/forgot-password?email=${encodeURIComponent(
        formData.email
      )}`;
      await axios
        .post(url)
        .then((response) => {
          setFormData({ ...formData, token: response.data.token });
          setMode(2);
          set_errorMsg({...errorMsg, token:""})
        })
        .catch((error) => {
          set_errorMsg({
            ...errorMsg,
            token: error.response.data.message
            
          });
        });
    }
    if (mode === 2) {
      let url = `${process.env.REACT_APP_API_URL_PREFIX}/api/v1/auth/reset-password?newPassword=${formData.newPassword}&token=${formData.token}`;
      await axios
        .post(url)
        .then((response) => {})
        .catch((error) => {
            set_errorMsg({
                ...errorMsg,
                chngPass: error.response.data.message
                
              });
        });
    }
  };

  return (
    <div className="login-img">
      <div className="page">
        {/* <div className="dropdown float-end custom-layout">
          <div
            className="demo-icon nav-link icon mt-4 bg-primary"
            onClick={() => custompagesswitcherdata.Swichermainright()}
          >
            <i className="fe fe-settings fa-spin text_primary"></i>
          </div>
        </div> */}
        <div className="">
          <div
            className=""
            onClick={() => custompagesswitcherdata.Swichermainrightremove()}
          >
          <div className="col-log-6 col-login">
          <div className="text-center">
              <img
              style={{height: "5rem"}}
                src={require("../../assets/images/brand/govt2.png")}
                className="header-brand-img"
                alt=""
              />
            </div>
          </div>
            
          </div>
          <div className="container-login100">
            <Row>
              <Col className=" col-login mx-auto">
                <Form
                  className="card shadow-none"
                  onSubmit={(e) => {
                    handleForgot(e);
                  }}
                >
                  <Card.Body>
                    <div className="text-center">
                      <span className="login100-form-title">
                        Reset Password
                      </span>
                      <p className="text-muted">
                        Enter the email address registered on your account
                      </p>
                    </div>
                    <div className="pt-3" id="forgot">
                      <div className="wrap-input100 validate-input">
                        {/* <label className="form-label">E-Mail</label> */}
                        <input
                          type="email"
                          className="form-control input100"
                          // password="true"
                          autoComplete="off"
                          name="email"
                          placeholder="Email"
                          required
                          onChange={handleInputChange}
                          value={formData.email}
                        />
                        <span className="focus-input100"></span>
                        <span className="symbol-input100">
                          <i
                            className="zmdi zmdi-account"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>
                      {formData.token && (
                        <>
                          <div className="wrap-input100 validate-input">
                            {/* <label className="form-label">E-Mail</label> */}
                            <input
                              type="text"
                              className="input100 form-control"
                              // password="true"
                              autoComplete="off"
                              name="newPassword"
                              placeholder="New Password"
                              required
                              onChange={handleInputChange}
                              value={formData.newPassword}
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                              <i
                                className="zmdi zmdi-lock"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </div>
                          <div className="wrap-input100 validate-input">
                            {/* <label className="form-label">E-Mail</label> */}
                            <input
                              type="text"
                              className="input100 form-control"
                              // password="true"
                              autoComplete="off"
                              name="confpass"
                              placeholder="Confirm Password"
                              required
                              onChange={handleInputChange}
                              value={formData.confpass}
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                              <i
                                className="zmdi zmdi-lock"
                                aria-hidden="true"
                              ></i>
                            </span>
                            {/* {changeBtn.vldtCheck ? (changeBtn.mobOtp ? <span className="symbol-input1000"><i className="zmdi zmdi-check" style={{ color: "green" }}></i></span> : <span className="symbol-input1000"><i className="zmdi zmdi-close" style={{ color: "red" }}></i></span>) : ""} */}
                          </div>
                        </>
                      )}
                      {errorMsg.pass ? (
                        <div className="text-red text-center">{errorMsg.pass}</div>
                      ) : (
                        ""
                      )}
                      {errorMsg.token ? (
                        <div className="text-red text-center">{errorMsg.token}</div>
                      ) : errorMsg.chngPass? (
                        <div className="text-red text-center">{errorMsg.chngPass}</div>
                      ):""}
                      <div className="container-login100-form-btn">
                        <button
                          type="submit"
                          className="login100-form-btn btn-primary"
                        >
                          Forget
                        </button>
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-dark mb-0">
                          Forgot It?
                          <Link
                            className="text-primary ms-1"
                            to={`${process.env.PUBLIC_URL}/`}
                          >
                            Login
                          </Link>
                        </p>
                      </div>
                    </div>
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
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

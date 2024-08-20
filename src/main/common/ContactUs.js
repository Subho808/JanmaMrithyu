import React, { useRef, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import MsgAlert from "./MsgAlert";
import Spinner from 'react-bootstrap/Spinner';

const ContactUs = () => {
  const [result, setResult] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult(true);
    const formData = new FormData(event.target);

    formData.append("access_key", "8548b7ce-4544-4ffc-85f4-33c2cc3e8cec");
    formData.append("from_name", "Janma-Mrityu Tathya");
    formData.append(
      "subject",
      "A new message has just been submitted on your website — check it out!"
    );
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(false);
        event.target.reset();
        setMsg(data.message);
        setMsgTyp("AI");
      } else {
        console.log("Error", data);
        setMsg(data.message);
        setMsgTyp("AE");
        setResult(false)
      }
    } catch (error) {
      setMsg(
        "Failed to submit the form. Please check your network connection and try again."
      );
      setMsgTyp("AE");
      // setResult(false)
    }
  };


const resetForm=()=>{
  setMsg("");
  setMsgTyp("")
  setResult(false)
  document.getElementById("myForm").reset();
}


  return (
    <div>
      <div className="container">
        {msg && <MsgAlert msg={msg} msgTyp={msgTyp} />}
        <h4 className="mb-4 fw-bold">Contact Us</h4>

        <div className="row ">
          <form className="form-horizontal" id="myForm"  onSubmit={onSubmit}>
            {/* certificate Id */}
            {
              <div className=" row mb-4">
                <label className="col-md-3 form-label">
                  Email ID<span className="text-red">*</span>
                </label>
                <div className="col-md-9 input-group">
                  <input
                    className="form-control ui_displayd_txt_"
                    type="email"
                    placeholder="Email ID"
                    name="email"
                    required
                  />
                </div>
              </div>
            }
            {/* certificate No */}
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Name<span className="text-red">*</span>
              </label>
              <div className="col-md-9">
                <div className="input-group">
                  <input
                    className="form-control ui_displayd_txt_"
                    type="text"
                    placeholder="Name"
                    maxLength={50}
                    name="name"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Name */}
            <div className=" row mb-4 ">
              <label className="col-md-3 form-label">
                Message<span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <textarea
                  style={{ height: "150px" }}
                  className="form-control ui_entryd_txt_rc"
                  type="text"
                  placeholder="Message"
                  required
                  name="message"
                  maxLength={500}
                />
              </div>
            </div>
            <input type="hidden" name="redirect" value="https://web3forms.com/success"></input>
            {result ? (
              <button className="btn btn-primary" >
        <Spinner
        style={{color:"#ffffff"}}
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />&nbsp;
        Loading...
      </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            )}
            {
              <button className="btn btn-secondary mx-2" type="button" onClick={resetForm}>
                Reset
              </button>
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

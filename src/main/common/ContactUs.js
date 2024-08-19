import React, { useRef, useState } from "react";
// import ConfirmDialog from "../../common/ConfirmDialog";
import LinearProgress from '@mui/material/LinearProgress';

const ContactUs = () => {

    const [result, setResult] = React.useState(false);
    const [errMsg, setErrMsg] = useState("")


    const onSubmit = async (event) => {
        event.preventDefault();
        setResult(true);
        const formData = new FormData(event.target);

        formData.append("access_key", "a053666f-8a03-468a-a4ba-571148bf7a21");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult(false);
            event.target.reset();
        } else {
            console.log("Error", data);
            setErrMsg(data.message)
        }
    };


    return (
        <div>
            <div className="container">

                <h4 className="mb-4 fw-bold">Contact Us</h4>

                <div className="row ">
                    <form className="form-horizontal" onSubmit={onSubmit} >
                        {/* certificate Id */}
                        {<div className=" row mb-4">
                            <label className="col-md-3 form-label">
                                Email ID<span className="text-red">*</span>
                            </label>
                            <div className="col-md-9 input-group">
                                <input
                                    className="form-control ui_displayd_txt_"
                                    type="email"
                                    placeholder=""
                                    name="email"
                                    required
                                />
                            </div>
                        </div>}
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
                                        placeholder=""
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
                                style={{height:"150px"}}
                                    className="form-control ui_entryd_txt_rc"
                                    type="text"
                                    placeholder="Message"
                                    required
                                    name="message"
                                    maxLength={500}
                                />
                            </div>
                        </div>
                        <div className="text-red text-center">{errMsg}</div>
                        
                        

                        { result?
                            <button
                                type=""
                                className="btn btn-primary"
                            >
                            <i class="fa fa-circle-o-notch fa-spin" style={{color:"black", fontSize:"medium"}}></i>&nbsp;
                                Submit
                            </button> :
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Submit
                            </button>
                        }
                        {(
                            <button
                                className="btn btn-secondary mx-2"
                                type="reset"
                            >
                                Reset
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

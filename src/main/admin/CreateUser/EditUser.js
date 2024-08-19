import React, { useState, useRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getApiToken } from "../../common/common";
import { Alert } from "react-bootstrap";
import { log } from "nvd3";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import * as sweetalerts from "../../../data/Component/sweetalerts/sweetalerts";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";

export const EditUser = ({
  editMode,
  post,
  dispatch,
  mode,
  rowId,
  setData,
  data,
  onClose,
  row,
  rowData,
  index,
  queryInputObj,
  msg,
  setMsg,
  msgTyp,
  setMsgTyp,
  addVal,
  setEdtVal,
  edtVal,
  parMsg,
  setParMsg,
  parMsgTyp,
  setParMsgTyp,
  errExp,
  set_errExp,
  parErrExp,
  set_parErrExp,
}) => {
  const fetchData = async () => {
    await axios
      .get(
        process.env.REACT_APP_API_URL_PREFIX +
          `/api/v1/users/${queryInputObj.userId}`,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        setData(res?.data);
        console.log(data);
      });
  };
  const headers = { Authorization: "Bearer " + getApiToken() };
  console.log(mode);
  console.log(rowData);
  console.log(rowId);
  console.log(addVal);

  // const [msg, setMsg] = useState("")
  // const [msgTyp, setMsgTyp] = useState("")

  const [formData, setFormData] = useState({
    id: rowData ? rowData.id : "",
    name: rowData ? rowData.name : "",
    email: rowData ? rowData.email : "",
    password: rowData ? rowData.password : "",
    about: rowData ? rowData.about : "",
    roles: rowData
      ? rowData.roles.map((item) => {
          return item;
        })
      : [
          {
            id: 0,
            name: "NORMAL_USER",
          },
        ],
  });

  console.log(formData);

  // useEffect(() => {
  //   if (mode === 1) {
  //     setEdtVal({
  //       modGrpId: "",
  //       modGrpNm: "",
  //       actFlg: "A",
  //     });
  //   }
  // }, [mode]);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setCharCount({ ...charCount, [event.target.name]: true });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setEdtVal({ ...edtVal, [event.target.name]: event.target.value });
  };

  const validateInput = (formData) => {
    if (!formData.name.trim() || formData.dev_nm.trim() === "") {
      return false;
    }
    if (!formData.addr.trim() || formData.addr.trim() === "") {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {
    setMsg("")
    setMsgTyp("")
    setFormData({
      id:  "",
      name: "",
      email: "",
      password: "",
      about: "",
      roles: [
            {
              id: 0,
              name: "string",
            },
          ],
    });
  };
  const resetForm1 = () => {
    setFormData({
      id:  "",
      name: "",
      email: "",
      password: "",
      about: "",
      roles: [
            {
              id: 0,
              name: "string",
            },
          ],
    });
  };


  const [charCount, setCharCount] = useState({
    modGrpNm: false,
  });

  const handleCharCount = (event) => {
    setCharCount({ ...charCount, [event.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id,roles, ...obj } = formData;
    const addObj = {
      ...obj,
      // roles: obj.roles.map((item) => {
      //   return {
      //     ...item,
      //     id: parseInt(item.id),
      //   };
      // }),
    };

    const editObj = {
      ...formData,
      id: parseInt(formData.id),
      roles: formData.roles.map((item) => {
        return {
          ...item,
          id: parseInt(item.id),
        };
      }),
    };


    if (mode === 1)
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + "/api/v1/users/", addObj, {
          headers,
        })
        .then((res) => {
          console.log(res.data);
          if (!res?.data) {
            fetchData();
            setMsg("Record inserted successfully");
            setMsgTyp("AI");
            resetForm1();
          }

        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 2)
      await axios
        .put(
          process.env.REACT_APP_API_URL_PREFIX + `/api/v1/users/${formData.id}`,
          editObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (!res?.data?.appMsgList?.errorStatus) {
            //TRUE OPERATION
            fetchData();
            setMsg("Record update successful");
            setMsgTyp("AI");
          }
        })
        .catch((error) => {
          console.log("error");
        });

    if (mode === 3) {
      set_open(true);
      // Show confirmation dialog
      // Swal.fire({
      //     title: "Are you sure?",
      //     // text: "You won't be able to revert this!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: "Yes, delete it!",
      //     backdrop: true,
      // }).then((result) => {
      // if (result.isConfirmed) {
      // If user confirms, make the delete API call
      // if (window.confirm("Are you sure? The record will be deleted parmanantly")) {
      //   axios
      //     .post(process.env.REACT_APP_API_URL_PREFIX + '/SUF00001/saveDelete', deleteObj, { headers })
      //     .then((res) => {
      //       console.log(res.data);
      //       if (!res?.data?.appMsgList?.errorStatus) {
      //         fetchData();
      //       }
      //       setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")");
      //       setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
      //       set_parErrExp({ status: res.data?.appMsgList?.errorStatus })
      //     })
      //     .catch((error) => {
      //       console.log("error");
      //     });
      // }
      // });
    }
  };

  const pageTitle = editMode ? "Edit Post" : "Create Post";

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };
  const buttonTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Save";
        break;
      case 2:
        return "Update";
        break;
      case 3:
        return "Delete";
        break;
      case 4:
        return "View";
        break;

      default:
        return "Unknown";
        break;
    }
  };

  const [open, set_open] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [delStatus, set_delStatus] = useState(false);
  const handleConfirmation = async () => {

    axios.delete(
        process.env.REACT_APP_API_URL_PREFIX +
          `/api/v1/users/${formData.id}`,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (res?.data) {
          fetchData();
          setMsg("Record deleted successful");
          setMsgTyp("AI");
        }
        set_delStatus(true);
      })
      .catch((error) => {
        console.log("error");
        setMsg(error.response.data.message);
        setMsgTyp("AE");

      });
  };

  const msgRef = useRef(null);
  const [viewMsg, set_viewMsg] = useState(false);
  useEffect(() => {
    if (viewMsg) msgRef?.current?.scrollIntoView({ behavior: "smooth" });
    set_viewMsg(false);
  }, [viewMsg]);

  return (
    <div>
      <div className="container">
        {msg && (
          <div ref={msgRef}>
            {" "}
            <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />
          </div>
        )}
        <h4 className="card-title">User {getFormTitle(mode)}</h4>

        <form
          className="form-horizontal"
          onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}
        >
          {mode!==1 && <div className=" row mb-4">
            <label className="col-md-3 form-label">Id</label>
            <div className="col-md-9">
              <input
                className="form-control border "
                type="text"
                name="id"
                value={formData.id}
                readOnly
              />
            </div>
          </div>}
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Name <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Name"
                required
                maxLength={50}
                disabled={mode === 3 || mode === 4}
              />
              {/* {charCount.modGrpNm && <span className="input-group-text">{formData.name.length}/50</span>} */}
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Email <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="Email"
                required
                // maxLength={50}
                disabled={mode === 3 || mode === 4}
              />
              {/* {charCount.modGrpNm && <span className="input-group-text">{formData.name.length}/50</span>} */}
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              Password <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="password"
                required
                // maxLength={50}
                disabled={mode === 3 || mode === 4}
              />
              {/* {charCount.modGrpNm && <span className="input-group-text">{formData.name.length}/50</span>} */}
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">
              About <span className="text-red">*</span>
            </label>
            <div className="col-md-9 input-group">
              <input
                className="form-control"
                type="text"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                onBlur={handleCharCount}
                placeholder="About"
                required
                // maxLength={50}
                disabled={mode === 3 || mode === 4}
              />
              {/* {charCount.modGrpNm && <span className="input-group-text">{formData.name.length}/50</span>} */}
            </div>
          </div>

          {mode !== 4 && (
            <button
              type="submit"
              disabled={delStatus}
              className="btn btn-primary"
            >
              {buttonTitle(mode)}
            </button>
          )}
          {mode == 1 && (
            <button
              className="btn btn-secondary mx-2"
              type="reset"
              //onClick="resetForm"
              onClick={(e) => resetForm()}
            >
              Reset
            </button>
          )}
        </form>

        {/* <div className="container text-center">
                    <input
                        className="btn btn-success"
                        type="submit"
                        defaultValue="Submit"
                    />
                </div> */}
        {/* </div> */}
      </div>

      <ConfirmDialog
        title="Confirmation"
        open={open}
        setOpen={set_open}
        onConfirm={handleConfirmation}
        setConfirmStatus={setConfirmStatus}
        confirmStatus={confirmStatus}
      >
        Are you sure you want to delete this record?
      </ConfirmDialog>
    </div>
  );
};

//Secondaryalertbutton
export function Secondaryalertbutton() {
  Swal.fire({
    title: "Your message",
    text: "Your message",
    allowOutsideClick: false,
    confirmButtonText: "ok",
  });
}

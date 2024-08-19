import React, { useRef, useState } from "react";
import ConfirmDialog from "../../common/ConfirmDialog";
import MsgAlert from "../../common/MsgAlert";
import { useEffect } from "react";
import { getApiToken } from "../../common/common";
import axios from "axios";
import { getScplAdContext } from "../../common/common";
import { Delete, Download } from "@mui/icons-material";
import Smalltag from "../../common/SmallTag/smalltag";
import moment from "moment/moment";
const headers = { Authorization: "Bearer " + getApiToken() };
const userId = getScplAdContext().user.id
console.log(userId);

const UploadFilesForm = ({
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
  msg,
  setMsg,
  msgTyp,
  setMsgTyp,
  errExp,
  queryInputObj,
}) => {
  console.log(mode);
  console.log(rowData);
  console.log(rowId);

  const fetchData = async () => {
    await axios
      .get(
        process.env.REACT_APP_API_URL_PREFIX +
          `/api/v1/getAllUpldCertificate`,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        setData(res?.data);
        console.log(data);
      });
  };



  const [formData, setFormData] = useState({
      // addedDate: rowData? moment(rowData.addedDate).isValid() ?moment(rowData.addedDate).format("YYYY-MM-DD"):"": "",
      address: rowData? rowData.address:"",
      certId: rowData? rowData.certId:0,
      certificateNo: rowData? rowData.certificateNo:"",
      // dateOfBirth: rowData? moment(rowData.dateOfBirth).isValid() ?moment(rowData.dateOfBirth).format("YYYY-MM-DD"):"":"",
      fatherName: rowData? rowData.fatherName:"",
      gender: rowData? rowData.gender:"",
      imageName: rowData? rowData.imageName:"",
      motherName: rowData? rowData.motherName:"",
      name: rowData? rowData.name:"",
      addedDate: rowData && moment(rowData.addedDate, "DD-MM-YYYY").isValid() 
      ? moment(rowData.addedDate, "DD-MM-YYYY").format("YYYY-MM-DD") 
      : "",
    dateOfBirth: rowData && moment(rowData.dateOfBirth, "DD-MM-YYYY").isValid() 
      ? moment(rowData.dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD") 
      : "",

  });

  useEffect(() => {
    set_doc([{imageName: rowData? rowData.imageName:""}])

  }, [rowData])
  
console.log(formData);
  const handleInputChange = (event) => {
    const {name, value}= event.target;
    if(name==="certificateNo"){
      setCharMsg("")
    }
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateInput = (formData) => {
    if (!formData.rollCode.trim() || formData.rollCode.trim() === "") {
      return false;
    }
    if (!formData.rollName.trim() || formData.rollName.trim() === "") {
      return false;
    }

    // other validations

    return true;
  };
  const resetForm = () => {
    setFormData({
      addedDate:"",
      address:"",
      certId:0,
      certificateNo:"",
      dateOfBirth:"",
      fatherName:"",
      gender:"",
      imageName:"",
      motherName:"",
      name:""
    });
  };
  const resetForm1 = () => {
    setFormData({
      addedDate:"",
      address:"",
      certId:0,
      certificateNo:"",
      dateOfBirth:"",
      fatherName:"",
      gender:"",
      imageName:"",
      motherName:"",
      name:""
    });
  };

const [charMsg, setCharMsg] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.certificateNo.length < 10) {
      setCharMsg("Certificate number must be at least 10 characters long.");
      return;
    } else if (formData.certificateNo.length > 20) {
      setCharMsg("Certificate number must not exceed 20 characters.");
      return;
    }
    const { id, ...obj } = formData;
    const addObj = {
     ...formData,
     dateOfBirth: moment(formData.dateOfBirth).format("DD-MM-YYYY"),
    }

    const editObj = {
      ...formData,
      imageName: doc[0]?.imageName,
      dateOfBirth: moment(formData.dateOfBirth).format("DD-MM-YYYY"),
    
    };


    if (mode === 1)
      await axios
        .post(process.env.REACT_APP_API_URL_PREFIX + `/api/v1/user/${userId}/upldCertificate`, addObj, {
          headers,
        })
        .then((res) => {
          console.log(res.data);
          if (res?.data) {
            fetchData();
            setDialogObj({
              status: true,
              type: "alert",
              title: "Information",
              msg: "Please go to the edit option for this record and upload the file."
            })
            setMsg("Record inserted successfully");
            setMsgTyp("AI");
            resetForm1();
          }

        })
        .catch((error) => {
          console.log("error");
          setMsg("Error occured durin insert");
          setMsgTyp("AI");
        });

    if (mode === 2)
      await axios
        .put(
          process.env.REACT_APP_API_URL_PREFIX + `/api/v1/editUpldCert/${formData.certId}`,
          editObj,
          { headers }
        )
        .then((res) => {
          console.log(res.data);
          if (res?.data) {
            //TRUE OPERATION
            fetchData();
            setMsg("Record update successful");
            setMsgTyp("AI");
          }
        })
        .catch((error) => {
          console.log("error");
          setMsg("Error occured durin update");
          setMsgTyp("AE");
        });

    if (mode === 3) {
      setDialogObj({
        status: true,
        onConfirm: ()=>handleConfirmation(),
        type: "confirm",
        title: "Confirmation",
        msg: "Do you want to delete this record"
      })
      
    }
  };
  console.log(msg);
  
  const [dialogObj, setDialogObj] = useState({
    status: false,
    onConfirm: ()=>{},
    msg: ""
  })
  
  const handleConfirmation = async () => {
    

    axios.delete(
        process.env.REACT_APP_API_URL_PREFIX +
          `/api/v1/deleteUpldCert/${formData.certId}`,
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (res?.data) {
          fetchData();
          setMsg("Record deleted successfully");
          setMsgTyp("AI");
        }
        
      })
      .catch((error) => {
        console.log("error");
        setMsg("Error occured durin delete");
        setMsgTyp("AE");
      });
  };

  const pageTitle = editMode ? "Edit Post" : "Create Post";

  const getFormTitle = (mode) => {
    switch (mode) {
      case 1:
        return "Add New";
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
  const buttonTitle = getFormTitle(mode);

  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  // Character Counter
  const [fieldCharCountVisibility, setFieldCharCountVisibility] = useState({
    rollName: false,
    // Add more fields here as needed
  });

  // Function to toggle character count visibility for a field
  const toggleCharCountVisibility = (fieldName) => {
    setFieldCharCountVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const [doc, set_doc] = useState([]);
  const [fileErr_msg, set_fileErr_msg] = useState("")
  const uploadFiles = async (e, certId) => {
    
    if (mode > 2) return

    const { files } = e.target;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      if (files[i].size > 1000 * 1000 * 1) {
        set_fileErr_msg("File size exceded : 1mb")
        break;
      } else {
        set_fileErr_msg("")
      }
      formData.append("image", files[i]);

      //"http://192.168.0.44/SuV4Sa/SUF00134/fileUpload?apiId=" + "SUA00486" + "&refApiId=" + "SUA00499" + "&appId=" + "" + "&mobRegNo=" + "",
      await axios
        .post(
          process.env.REACT_APP_API_URL_PREFIX + `/api/v1/upldCert/image/upload?certId=${certId}`,
          formData, { headers }
        )
        .then((res) => {
          if (res?.data) {
            // fileArr = [
            //   ...fileArr,
            //   {
            //     ...res.data
            //     //name: "File "+(doc.length+1+i)
            //     // name: files[i].name,
            //   },
            // ];
            set_doc([{ imageName: res.data.imageName }]);
          }
          else {
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc + " (" + res?.data?.appMsgList?.list[0]?.errCd + ")")
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }

  };

  const delete_file = async (e, i) => {
    set_doc(doc.filter((item, index) => index !== i));
  };



console.log(doc);

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
            <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />
          </div>
        )}
        <h4>Upload Files {getFormTitle(mode)}</h4>

        <div className="row ">
          <form className="form-horizontal" onSubmit={(e) => handleSubmit(e, mode, data, setData, onClose)}>
           {/* certificate Id */}
           {mode !==1 &&<div className=" row mb-4">
              <label className="col-md-3 form-label">
                Certificate Id<span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control ui_displayd_txt_"
                  type="text"
                  placeholder=""
                  name="certId"
                  value={formData.certId}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  readOnly

                />
              </div>
            </div>}
            {/* certificate No */}
            <div className=" row mb-4">
              <label className="col-md-3 form-label">
                Certificate No<span className="text-red">*</span>
              </label>
              <div className="col-md-9">
              <div className="input-group">
                <input
                  className="form-control ui_displayd_txt_"
                  type="text"
                  placeholder=""
                  maxLength={20}
                  name="certificateNo"
                  value={formData.certificateNo}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                 required
                 onFocus={() => toggleCharCountVisibility("certificateNo")}
                  onBlur={() => toggleCharCountVisibility("certificateNo")}
                />
                {fieldCharCountVisibility.certificateNo && (
                  <span className="input-group-text">
                    {formData.certificateNo.length}/20
                  </span>
                )}
              </div>
              <div className="text-red text-center">{charMsg}</div>
              </div>
              
              
            </div>
            {/* Name */}
            <div className=" row mb-4 ">
              <label className="col-md-3 form-label">
                Name<span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control ui_entryd_txt_rc"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder="Name"
                  required
                  name="name"
                  maxLength={50}
                  onFocus={() => toggleCharCountVisibility("name")}
                  onBlur={() => toggleCharCountVisibility("name")}
                />
                {fieldCharCountVisibility.name && (
                  <span className="input-group-text">
                    {formData.name.length}/50
                  </span>
                )}
              </div>
            </div>
             {/* Date Of Birth */}
             <div className="row mb-4">
              <label className="col-md-3 form-label">Date Of Birth:</label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control ui_entryd_txt_rc"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder=""
                  // required
                  name="dateOfBirth"
                />
              </div>
            </div>
            {/* Father Name */}
            <div className=" row mb-4 ">
              <label className="col-md-3 form-label">
                Father Name<span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control ui_entryd_txt_rc"
                  type="text"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder="Father Name"
                  required
                  name="fatherName"
                  maxLength={50}
                  onFocus={() => toggleCharCountVisibility("fatherName")}
                  onBlur={() => toggleCharCountVisibility("fatherName")}
                />
                {fieldCharCountVisibility.fatherName && (
                  <span className="input-group-text">
                    {formData.fatherName.length}/50
                  </span>
                )}
              </div>
            </div>
            {/* Mother Name */}
            <div className=" row mb-4 ">
              <label className="col-md-3 form-label">
                Mother Name<span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <input
                  className="form-control ui_entryd_txt_rc"
                  type="text"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder="Mother Name"
                  required
                  name="motherName"
                  maxLength={50}
                  onFocus={() => toggleCharCountVisibility("motherName")}
                  onBlur={() => toggleCharCountVisibility("motherName")}
                />
                {fieldCharCountVisibility.motherName && (
                  <span className="input-group-text">
                    {formData.motherName.length}/50
                  </span>
                )}
              </div>
            </div>
            {/* Gender */}
            <div className=" row mb-4">
              <label className="col-md-3 form-label">Gender:</label>
              <div className="col-md-9 ">
                <div className="row ">
                  <div className="col-md-2">
                    <label className="custom-control custom-radio col-md-2">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="gender"
                        defaultValue="Male"
                        // defaultChecked='true'
                        checked={formData.gender === "Male"}
                        value="Male"
                        onChange={handleStatusChange}
                        disabled={mode === 3 || mode === 4}
                      />
                      <span className="custom-control-label">Male</span>
                    </label>
                  </div>
                  <div className="col-md-2">
                    <label className="custom-control custom-radio col-md-2">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="gender"
                        checked={formData.gender === "Female"}
                        value="Female"
                        onChange={handleStatusChange}
                        disabled={mode === 3 || mode === 4}
                      />
                      <span className="custom-control-label">Female</span>
                    </label>
                  </div>
                  <div className="col-md-2">
                    <label className="custom-control custom-radio col-md-2">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="gender"
                        checked={formData.gender === "Others"}
                        value="Others"
                        onChange={handleStatusChange}
                        disabled={mode === 3 || mode === 4}
                      />
                      <span className="custom-control-label">Others</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
           
            {/*  Address */}
            <div className=" row mb-4 ">
              <label className="col-md-3 form-label">
                Address <span className="text-red">*</span>
              </label>
              <div className="col-md-9 input-group">
                <textarea
                  className="form-control ui_entryd_txt_rc"
                  type="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={mode === 3 || mode === 4}
                  placeholder="Address"
                  required
                  name="address"
                  maxLength={500}
                  onFocus={() => toggleCharCountVisibility("address")}
                  onBlur={() => toggleCharCountVisibility("address")}
                />
                {fieldCharCountVisibility.address && (
                  <span className="input-group-text">
                    {formData.address.length}/500
                  </span>
                )}
              </div>
            </div>
            {mode===2 &&<div className="row mb-4">
              <label className="form-label col-md-3">
                Attach Document<span className="text-red">*</span>
              </label>
              <div className="col-md-9">
                {(doc[0]?.imageName==="default.png"||doc?.length === 0) &&
                  <div className="file-upload">
                    <div className="input-name">Choose File</div>
                   { <input
                      type="file"
                      required={mode === 1}
                      className="form-control"
                      id="formFile"
                      onChange={(e)=>{uploadFiles(e, formData.certId)}}
                      name="File"
                      //required={!doc.length}
                      // multiple
                      // accept=".pdf"
                      disabled={mode === 3 || mode === 4}
                    />}
                  </div>
                }
                {doc.map((file, i) => (
                <div className="file-div">
                  {(file.imageName!=="default.png") && <Smalltag
                   
                    fontAwsmIcon={"fa-file"}
                    lable="File"
                    key={i}
                  />}
                  {mode === 2 && ((file.imageName!=="default.png") &&
                    <>
                      <Delete
                        onClick={(e) => delete_file(e, i)}
                        className="cross-icon"
                      />
                    </>
                  )}
                </div>
              ))}
              {fileErr_msg? <div className="text-red">{fileErr_msg}</div>:""}
              </div>

              
            </div>}
            {mode !== 4 && (
              <button
                type="submit"
                className="btn btn-primary"
              >
                {buttonTitle}
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
        </div>

        
        <ConfirmDialog
  title={dialogObj.title}
  open={dialogObj.status} 
  setOpen={(status)=> {setDialogObj({...dialogObj, status: status})}} 
  onConfirm={dialogObj.onConfirm} 
  // setConfirmStatus={setConfirmStatus}
  // confirmStatus={confirmStatus}
  dialogObj={dialogObj}
  setDialogObj={setDialogObj}
  type={dialogObj.type}
>
  {(dialogObj.type==="alert"?<div className="text-center pb-4 fs-5">{dialogObj.msg}</div> : <div className=" pb-4 text-center fs-5">{dialogObj.msg}</div>)}
</ConfirmDialog>
      </div>
    </div>
  );
};

export default UploadFilesForm;

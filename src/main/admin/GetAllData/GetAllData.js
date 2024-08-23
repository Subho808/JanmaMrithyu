import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ExportToCsv } from "export-to-csv";
import axios from "axios";
import { getApiToken, getScplAdContext } from "../../common/common";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: "Bearer " + getApiToken() };
let file = "";
const GetAllRecords = () => {
  const userId = getScplAdContext().user.id
  console.log(userId)
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });
  const [queryInputObj, setQueryInputObj] = useState({
    userId: userId,
    certificateNo: "",
  });
  const handleQryInputChange = (event) => {
    setQueryInputObj({
      ...queryInputObj,
      [event.target.name]: event.target.value,
    });
  };

  // Query Start..............
  const postQuery = async (e) => {
    e.preventDefault();
  
    const token = getApiToken();
    if (!token) {
      setMsg("Authorization token not available. Please log in again.");
      setMsgTyp("AE");
      return;
    }
    await axios
      .post(
        process.env.REACT_APP_API_URL_PREFIX + `/api/v1/getUpldCertificateNo`,
        queryInputObj,
        { headers }
      )
      .then((res) => {
        if (res.data) {
          setTableData2(res.data);
          file = res.data.imageName;
          setMsg("Records Found");
          setMsgTyp("AI");
        } else {
          setTableData2({});
          setMsg("No Records Found");
          setMsgTyp("AI");
        }
      })
      .catch((error) => {
        console.log(error);
        setMsg(error.message || "An error occurred");
        setMsgTyp("AE");
      });
  };
  

  // Query end...............

  const [tableData2, setTableData2] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData2[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData2(...tableData2);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );
  const columns = useMemo(
    () => [
      {
        accessorKey: "fristName",
        header: "First Name",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 80,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 40,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 40,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 40,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "profile",
        header: "Profile",
        size: 40,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );
  const download_file = async () => {
    await axios
      .get(
        process.env.REACT_APP_API_URL_PREFIX + `/api/v1/upldCrt/image/${file}`,
        {
          headers: {
            Authorization: headers?.Authorization,
            // Accept: "*/*" // Accept any content type
          },
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        //fileDownload(res.data, "file.pdf")
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const tempArr = file?.split(".") || [];
        const extention = tempArr[tempArr?.length - 1] || "pdf";
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file + "." + extention);
        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        //link.parentNode.removeChild(link);
      });
  };

  const handleReset = () => {
    setQueryInputObj({
      certificateNo: "",
      userId: userId
    });
    setTableData2({});
    file = "";
    setMsg("");
    setMsgTyp("");
  };

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Get Certificate Details</h1>
            <nav aria-label="breadcrumb" className="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item">
                  <a href="#" role="button" tabIndex={0}>
                    List Page
                  </a>
                </li>
                <li className="breadcrumb-item breadcrumb-item active breadcrumds">
                  <a href="#" role="button" tabIndex={0}></a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
        <div className="card">
          <div className="container-fluid mb-5">
            <form id="myForm" className="py-4" onSubmit={postQuery}>
              <div className="row mb-4">
                <div className="col-md-9 input-group mb-2">
                  <label className="col-md-3 form-label">
                    <b>
                      Certificate No:<span className="text-red">*</span>
                    </b>
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control border border-primary"
                      type="text"
                      placeholder="Certificate No"
                      name="certificateNo"
                      onChange={handleQryInputChange}
                      value={queryInputObj?.certificateNo}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="ms-4">
                    <button class="btn btn-primary" type="submit">
                      Query
                    </button>

                    <button
                      className="btn btn-secondary mx-2"
                      type="reset"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="row-container mb-4"
                style={{ border: "1px solid #6259ca" }}
              >
                <p className="mx-2">
                  <b>Certificate No:</b> &nbsp;{tableData2?.certificateNo}
                </p>
                <p className="mx-2">
                  <b>Name:</b> &nbsp;{tableData2?.name}
                </p>
                <p className="mx-2">
                  <b>Date Of Birth:</b> &nbsp;{tableData2?.dateOfBirth}
                </p>
                <p className="mx-2">
                  <b>Gender:</b> &nbsp;{tableData2?.gender}
                </p>
                <p className="mx-2">
                  <b>Address:</b> &nbsp;{tableData2?.address}
                </p>
              </div>
              <div className="d-flex justify-content-center w-100">
                <button
                  className="btn btn-primary col-md-3"
                  onClick={download_file}
                  type="button"
                >
                  Download
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetAllRecords;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

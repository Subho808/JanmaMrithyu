import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import CloseIcon from "@mui/icons-material/Close";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FileDownload from "@mui/icons-material/FileDownload";
import {
  Button,
  Dialog,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import UploadFilesForm from "./UploadCrud";
import axios from "axios";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken, getScplAdContext } from "../../common/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const headers = { Authorization: "Bearer " + getApiToken() };

const UploadFiles = () => {
  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null,
  });
  const [render, setRender] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const [tableData, setTableData] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [queryInputObj, setQueryInputObj] = useState({
    certNo: "",
  });
  const handleQueryInputChange = (event) => {
    setQueryInputObj({
      [event.target.name]: event.target.value,
    });
  };
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });

  const postQuery = async (e) => {
    e.preventDefault();

    return await axios
      .get(
        process.env.REACT_APP_API_URL_PREFIX + `/api/v1/getAllUpldCertificate?certificateNo=${queryInputObj.certNo}`,
        { headers }
      )
      .then((res) => {
        if (res.data.length) {
          setTableData(res.data);
          setMsg("Records Found");
          setMsgTyp("AI");
        } else {
          setTableData([]);
          setMsg("No Records Found");
          setMsgTyp("AI");
        }
      })
      .catch((error) => {
        console.log(error);
        setMsg(error);
        setMsgTyp("AE");
      });
  };

  const handleReset = () => {
    setQueryInputObj({
      certNo: "",
    });
    setTableData([]);
    setMsg("");
    setMsgTyp("");
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

  const handleExportData = () => {
    csvExporter.generateCsv(tableData);
  };

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue("firstName")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => {
    setDialogOpen(false);
  };
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  const download_file = async (file) => {
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
        console.log(link);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        //link.parentNode.removeChild(link);
      });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "certId",
        header: "Certificate Id",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "certificateNo",
        header: "Certificate No",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "fatherName",
        header: "Father Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "motherName",
        header: "Mother Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 240,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "imageName",
        header: "File",
        size: 40,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ renderedCellValue, row }) => (
          // <IconButton color="#success"  className="btn" onClick={() => handleFileUrlClick(row.original.fileUrl)}>
          //   {(row?.original?.fileUrl)? <button className="btn"  style={{color:"#6259ca"}}/> : <button className="btn"  style={{color:"#black"}}/>}
          // </IconButton>
          <IconButton
            disabled={row.original.imageName === "default.png"}
            onClick={() => {
              download_file(row.original.imageName);
              console.log(row.original.imageName);
            }}
            style={{ color: "#6259ca" }}
          >
            <FileDownload />
          </IconButton>
        ),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  return (
    <>
      <div>
        <div className="page-header">
          <div className="">
            <h1 className="page-title">Upload Files</h1>
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
          <div className="ms-auto pageheader-btn">
            <a
              className="btn btn-primary btn-icon text-white"
              onClick={() =>
                setCreateModalOpen({
                  open: true,
                  mode: 1,
                  rowData: null,
                })
              }
              variant="contained"
            >
              <span>
                <i className="fe fe-plus" />
                &nbsp;
              </span>
              Add New
            </a>
            &nbsp;
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}
        <div className="card">
        <div className="container-fluid mb-5">
        <form onSubmit={postQuery}>
            <div className="row mb-4 ms-4 mt-4">
              <label
                for="exampleFormControlSelect1"
                className="col-md-3 form-label"
              >
                <b>Certificate No:</b>
              </label>
              <div className="col-md-6">
                <input
                  className="form-control border border-primary"
                  type="text"
                  id="exampleFormControlSelect1"
                  placeholder="Certificate No"
                />
              </div>
              <div className="col-md-3">
                <div className="">
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
          </form>
          <MaterialReactTable
              autoResetPageIndex={false}
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  muiTableHeadCellProps: {
                    align: "center",
                  },
                  size: 120,
                },
              }}
              columns={columns}
              data={tableData}
              editingMode="modal"
              enableRowSelection
              enableColumnOrdering
              enableEditing
              positionToolbarAlertBanner="bottom"
              onEditingRowSave={handleSaveRowEdits}
              onEditingRowCancel={handleCancelRowEdits}
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Edit">
                    <IconButton
                      color="success"
                      onClick={() =>
                        setCreateModalOpen({
                          open: true,
                          mode: 2,
                          rowData: tableData[row.index],
                          index: row.index,
                          queryInputObj,
                          //rowData:[1,2,3]
                        })
                      }
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow placement="right" title="View">
                    <IconButton
                      color="warning"
                      onClick={() =>
                        setCreateModalOpen({
                          open: true,
                          mode: 4,
                          rowData: tableData[row.index],
                          index: row.index,
                        })
                      }
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow placement="right" title="Delete">
                    <IconButton
                      color="error"
                      onClick={() =>
                        setCreateModalOpen({
                          open: true,
                          mode: 3,
                          rowData: tableData[row.index],
                          queryInputObj,
                        })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              renderTopToolbarCustomActions={({ table }) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      p: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      className="btn btn-primary fs-10"
                      //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                      onClick={handleExportData}
                      startIcon={<FileDownloadIcon />}
                      variant="contained"
                    >
                      Export All Data
                    </Button>
                    <Button
                      className="btn btn-primary fs-10"
                      disabled={
                        table.getPrePaginationRowModel().rows.length === 0
                      }
                      //export all rows, including from the next page, (still respects filtering and sorting)
                      onClick={() =>
                        handleExportRows(table.getPrePaginationRowModel().rows)
                      }
                      startIcon={<FileDownloadIcon />}
                      variant="contained"
                    >
                      Export All Rows
                    </Button>
                    <Button
                      className="btn btn-primary fs-10"
                      disabled={table.getRowModel().rows.length === 0}
                      //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                      onClick={() => handleExportRows(table.getRowModel().rows)}
                      startIcon={<FileDownloadIcon />}
                      variant="contained"
                    >
                      Export Page Rows
                    </Button>
                    <Button
                      className="btn btn-primary fs-10"
                      disabled={
                        !table.getIsSomeRowsSelected() &&
                        !table.getIsAllRowsSelected()
                      }
                      //only export selected rows
                      onClick={() =>
                        handleExportRows(table.getSelectedRowModel().rows)
                      }
                      startIcon={<FileDownloadIcon />}
                      variant="contained"
                    >
                      Export Selected Rows
                    </Button>
                  </Box>
                </>
              )}
            />
        </div>
          

          {/* fileOpen Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={closeDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle sx={{ m: 1, p: 2 }}>
              <IconButton
                aria-label="close"
                onClick={closeDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="text-center">
                <img
                  src={process.env.REACT_APP_API_URL_PREFIX + selectedFileUrl}
                />
              </div>
            </DialogContent>
            {/* <DialogActions>
          <Button onClick={closeDialog} color="primary">
            OK
          </Button>
        </DialogActions> */}
          </Dialog>
        </div>
      </div>

      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen.open}
        onClose={() =>
          setCreateModalOpen({
            open: false,
            mode: 0,
            rowId: -1,
            rowData: null,
          })
        }
        render={render}
        setRender={setRender}
        onSubmit={handleCreateNewRow}
        mode={createModalOpen.mode}
        rowId={createModalOpen.rowId}
        data={tableData}
        setData={setTableData}
        rowData={createModalOpen.rowData}
        setParMsg={setMsg}
          setParMsgTyp={setMsgTyp}
          parMsg={msg}
          parMsgTyp={msgTyp}
      />
    </>
  );
};

export default UploadFiles;
//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  mode,
  rowId,
  setData,
  data,
  rowData,
  index,
  parMsgTyp,
  parMsg,
  setParMsg,
  setParMsgTyp,
}) => {
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setMsg("");
    setMsgTyp("");
  };

  // const [dlgElem, setDlgElem] = useState();
  const setDlgElem = (column) => {
    const dlgElem = null;
    switch (column.fldType) {
      default:
        const dlgElem = (
          <TextField
            key={column.accessorKey}
            label={column.header}
            name={column.accessorKey}
          />
        );
    }
    return dlgElem;
  };

  return (
    <Dialog open={open} setData={setData} data={data} fullWidth maxWidth="lg">
      <DialogTitle sx={{ m: 1, p: 2 }}>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon style={{ color: "black" }} />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <UploadFilesForm
          mode={mode}
          setData={setData}
          data={data}
          rowData={rowData}
          index={index}
          msg={msg}
          setMsg={setMsg}
          msgTyp={msgTyp}
          setMsgTyp={setMsgTyp}
          setParMsg={setParMsg}
          setParMsgTyp={setParMsgTyp}
          parMsg={parMsg}
          parMsgTyp={parMsgTyp}
        />
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}></DialogActions>
    </Dialog>
  );
};
const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Breadcrumb } from "react-bootstrap";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { EditUser } from "./EditUser";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken } from "../../common/common";
const headers = { Authorization: "Bearer " + getApiToken() };

const CreateUser = () => {
  console.log(headers);
  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null,
  });
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [render, setRender] = useState(0);
  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      setTableData([...tableData]);
      exitEditingMode();
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 240,
    },
    {
      accessorKey: "email",
      header: "Email ID",
      size: 40,
    },
    {
      accessorKey: "about",
      header: "About",
      size: 40,
    },
  ]);

  //1st
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  //csv files
  const csvExporter = new ExportToCsv(csvOptions);

  //functions
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(tableData);
  };

  const resetForm = () => {
    setTableData([]);
    setQueryInputObj({
      email: "",
    });
    setMsg("");
    setMsgTyp("");
  };
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [queryInputObj, setQueryInputObj] = useState({
    email: "",
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
        process.env.REACT_APP_API_URL_PREFIX +
          `/api/v1/users/?emailId=${queryInputObj.email}`,
        { headers }
      )
      .then((res) => {
        if (res.data) {
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
        setMsg(error.response.data.message);
        setMsgTyp("AE");
      });
  };

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Create User</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item className="breadcrumb-item" href="#">
                List Page
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              ></Breadcrumb.Item>
            </Breadcrumb>
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
          </div>
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}

        <div className="card">
          <div className="container-fluid mb-5">
            <form onSubmit={postQuery} id="myForm" className="py-4">
              <div className="row mb-2 mx-2 ">
                <label
                  htmlFor="exampleFormControlSelect1"
                  className="col-sm-3 col-form-label"
                >
                  <b>User Email:</b>
                  {/* <span className="text-red">*</span> */}
                </label>
                <div className="col-sm-4 mb-2">
                  <input
                    value={queryInputObj.email}
                    name="email"
                    onChange={handleQueryInputChange}
                    className="form-control"
                    type="email"
                    id="exampleFormControlSelect1"
                    placeholder="Enter Email Id"
                  />
                </div>

                <div className="col-sm-4">
                  <button className="btn btn-primary" type="submit">
                    Query
                  </button>

                  <button
                    className="btn btn-secondary mx-2"
                    type="reset"
                    onClick={(e) => resetForm()}
                  >
                    Reset
                  </button>
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
              //enableStickyHeader
              //muiTableContainerProps={{ sx: { maxHeight: '800px' } }}
              columns={columns}
              data={tableData}
              editingMode="modal" //default
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
            {/* <MaterialReactTable table={table} /> */}
          </div>
        </div>

        <CreateModal
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
          mode={createModalOpen.mode}
          data={tableData}
          setData={setTableData}
          rowData={createModalOpen.rowData}
          queryInputObj={queryInputObj}
          maxWidth="1200px"
          setParMsg={setMsg}
          setParMsgTyp={setMsgTyp}
          parMsg={msg}
          parMsgTyp={msgTyp}
        />
      </div>
    </>
  );
};

export default CreateUser;
export const CreateModal = ({
  open,
  parMsgTyp,
  parMsg,
  setParMsg,
  setParMsgTyp,
  onClose,

  mode,

  setData,
  data,
  rowData,

  queryInputObj,
}) => {
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });

  const handleClose = () => {
    onClose();
    setMsg("");
    setMsgTyp("");
  };

  return (
    <Dialog open={open} setData={setData} data={data} fullWidth maxWidth="md">
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
      <DialogContent className="pb-0">
        <EditUser
          mode={mode}
          setData={setData}
          data={data}
          rowData={rowData}
          queryInputObj={queryInputObj}
          msg={msg}
          setMsg={setMsg}
          msgTyp={msgTyp}
          setMsgTyp={setMsgTyp}
          errExp={errExp}
          set_errExp={set_errExp}
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

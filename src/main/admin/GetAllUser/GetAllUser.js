import React, { useCallback, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Tabs,
  Tab,
  OverlayTrigger,
  Breadcrumb,
  Card,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  // MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import axios from "axios";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken, getScplAdContext } from "../../common/common";
const headers = { Authorization: "Bearer " + getApiToken() };

const GetAllUser = () => {
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
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
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
      apiId: "SUA00086",
      criteria: {
        modGrpNm: "",
      },
    });
    setMsg("");
    setMsgTyp("");
  };
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");
  const [queryInputObj, setQueryInputObj] = useState({
    apiId: "SUA00086",
    criteria: {
      modGrpNm: "",
    },
  });
  const handleQueryInputChange = (event) => {
    setQueryInputObj({
      apiId: "SUA00086",
      criteria: {
        ...queryInputObj.criteria,
        [event.target.name]: event.target.value,
      },
    });
  };
  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });

  useEffect(() => {
    const postQuery = async (e) => {
      await axios
        .get(
          process.env.REACT_APP_API_URL_PREFIX + "/api/v1/users/",
          { headers }
        )
        .then((res) => {
          if (res.data?.length) {
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
    postQuery();
  }, []);

  const handle_savePath = async () => {
    let path = window.location.pathname;
    path = path.slice(1, path.length);
    const currentPath = JSON.parse(sessionStorage.getItem("currentPath"));
    const currentModule = sessionStorage.getItem("modId");
    const userId = getScplAdContext().userId;
    console.log(currentPath);
    const body = {
      apiId: "SUA00566",
      mst: {
        favNm: currentPath?.title,
        favUrl: currentPath?.path,
        menuId: currentPath?.menuId,
        modId: currentModule,
        ordBy: 0,
        userCd: userId,
      },
    };

    await axios
      .post(process.env.REACT_APP_API_URL_PREFIX + "/SUF00138/saveAdd", body, {
        headers,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Get All Users</h1>
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
          {/* <div className="ms-auto pageheader-btn">
                        <a
                            className="btn btn-primary btn-icon text-white"
                            onClick={() => setCreateModalOpen({
                                open: true,
                                mode: 1,
                                rowData: null
                            })}

                            variant="contained"
                        >
                            <span>
                                <i className="fe fe-plus" />
                                &nbsp;
                            </span>
                            Add New
                        </a>
                        &nbsp;
                        <Link
                            className="btn btn-success btn-icon text-white"
                            to={`${process.env.PUBLIC_URL}/SUF00001_03`}
                        >
                            <span>
                                <i className="fe fe-log-in" />
                                &nbsp;
                            </span>
                            Add Multiple
                        </Link>

                    </div> */}
        </div>
        {msg && <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} />}

        <div className="card">
          <div className="container-fluid mb-5">
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
              // enableEditing
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
        </div>
      </div>
    </>
  );
};

export default GetAllUser;
//example of creating a mui dialog modal for creating new rows
// export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, queryInputObj, parMsg, setParMsg, parMsgTyp, setParMsgTyp ,parErrExp, set_parErrExp }) => {

//     const [msg, setMsg] = useState("")
//     const [msgTyp, setMsgTyp] = useState("")
//     const [errExp, set_errExp] = useState({
//         status: true,
//         content: ""
//     })
//     const [addVal, setAddVal] = useState([])
//     const [edtVal, setEdtVal] = useState([])
//     const call_pageOpen_api = async (url, body, headers) => {
//         await axios.post(url, body, { headers }).then(res => {
//             setEdtVal(res.data.content.mst)
//             setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
//             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
//             set_errExp({status:res.data?.appMsgList?.errorStatus})

//         }).catch(error => {
//             console.log(error);
//         })
//     }

//     const call_formOpen_api = async (url, headers) => {
//         let obj = {
//             apiId: "SUA00088"
//         }
//         await axios.post(url, obj, { headers }).then(res => {
//             setAddVal(res.data.content.mst)
//             setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
//             setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
//             set_errExp({status:res.data?.appMsgList?.errorStatus})

//         }).catch(error => {
//             console.log(error);
//         })
//     }

//     // useEffect(()=>{
//     //     let url= "";
//     //     if (mode===1){
//     //         url = process.env.REACT_APP_API_URL_PREFIX +"/su/SUF00001/openAddForm";
//     //     }
//     //     open && call_formOpen_api(url, headers)
//     // }, [mode])

//     useEffect(() => {
//         let url = "";
//         let body = {}

//         if (mode === 1) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00001/openAddForm";
//         }
//         if (mode === 2) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00001/openEditForm";
//             body = {
//                 apiId: "SUA00093",
//                 mst: {
//                     modGrpId: rowData.modGrpId
//                 }
//             }
//         }
//         if (mode === 3) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00001/openDeleteForm";
//             body = {
//                 apiId: "SUA00097",
//                 mst: {
//                     modGrpId: rowData.modGrpId
//                 }
//             }
//         }
//         if (mode === 4) {
//             url = process.env.REACT_APP_API_URL_PREFIX + "/SUF00001/openViewForm";
//             body = {
//                 apiId: "SUA00092",
//                 mst: {
//                     modGrpId: rowData.modGrpId
//                 }
//             }

//         }

//         { (mode === 1) && open && call_formOpen_api(url, headers) }
//         { (mode !== 1) && open && call_pageOpen_api(url, body, headers) }
//     }, [mode])

//     const handleClose = () => {
//         onClose();
//     }

//     return (

//         <Dialog open={open} setData={setData} data={data} fullWidth
//             maxWidth="md" >
//             <DialogTitle sx={{ m: 1, p: 2 }} >

//                 {onClose ? (
//                     <IconButton
//                         aria-label="close"
//                         onClick={handleClose}
//                         sx={{
//                             position: 'absolute',
//                             right: 8,
//                             top: 8,
//                             color: (theme) => theme.palette.grey[500],
//                         }}
//                     >
//                         <CloseIcon style={{ color: "black" }} />
//                     </IconButton>
//                 ) : null}
//             </DialogTitle>
//             {/* <DialogTitle textAlign="center">Add New</DialogTitle> */}
//             <DialogContent className="pb-0" >
//                 {/* {msg&&<span>{msg}</span>} */}
//                 <ModuleGroupForm mode={mode} setData={setData} data={data} rowData={rowData} index={index} queryInputObj={queryInputObj}
//                     msg={msg} setMsg={setMsg} msgTyp={msgTyp} setMsgTyp={setMsgTyp} addVal={addVal} setEdtVal={setEdtVal} edtVal={edtVal} parMsg={parMsg}
//                 setParMsg={setParMsg} parMsgTyp={parMsgTyp} setParMsgTyp={setParMsgTyp} errExp={errExp} set_errExp={set_errExp}
//                 parErrExp={parErrExp} set_parErrExp={set_parErrExp} />
//             </DialogContent>
//             <DialogActions sx={{ p: "1.25rem" }}>
//                 {/* <Button onClick={onClose}>Cancel</Button> */}
//                 {/* <Button color="secondary" onClick={handleSubmit} variant="contained">
//       Add New
//     </Button> */}
//             </DialogActions>
//         </Dialog>

//     );
// };

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//     !!email.length &&
//     email
//         .toLowerCase()
//         .match(
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//         );
// const validateAge = (age) => age >= 18 && age <= 50;

import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Breadcrumb } from "react-bootstrap";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import MsgAlert from "../../common/MsgAlert";
import { getApiToken } from "../../common/common";
const headers = { Authorization: "Bearer " + getApiToken() };

const GetAllUser = () => {
  console.log(headers);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

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
  const [msg, setMsg] = useState("");
  const [msgTyp, setMsgTyp] = useState("");

  const [errExp, set_errExp] = useState({
    status: true,
    content: "",
  });

  useEffect(() => {
    const postQuery = async (e) => {
      await axios
        .get(process.env.REACT_APP_API_URL_PREFIX + "/api/v1/users/", {
          headers,
        })
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
              columns={columns}
              data={tableData}
              editingMode="modal" //default
              enableRowSelection
              enableColumnOrdering
              // enableEditing
              positionToolbarAlertBanner="bottom"
              onEditingRowSave={handleSaveRowEdits}
              onEditingRowCancel={handleCancelRowEdits}
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

import React, { useEffect, useState } from 'react'
import { MaterialReactTable } from "material-react-table";
import {
    Modal,

  } from "react-bootstrap";
  import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    
} from "@mui/material";

function Lov({moduleLovData, showModel, setShowModel, handleRowClick, columns, titel="Select Option", maxWidth="sm"}) {
    const [rowSelection, setRowSelection] = useState("");

    useEffect(() => {
      //do something when the row selection changes...
      if(rowSelection) setTimeout(() => {
        handleRowClick(rowSelection)
        setShowModel(false)
      }, "150");
    }, [rowSelection]);
    
   

    const handleCloseModal = () => {
      setShowModel(false);
    };

    

    return (
      <>
        <div className="row-mb-12">
         

          
          {(
            <div style={{zIndex: 1000}}>
            <Dialog fullWidth={true}
        maxWidth={maxWidth} open={showModel} >
            <DialogTitle sx={{ m: 1, p: 2 }} >{titel}</DialogTitle>
            <DialogContent className="pb-0" >
            
              <MaterialReactTable
      displayColumnDefOptions={{
        "mrt-row-actions": {
          muiTableHeadCellProps: {
            align: "center",
          },
          size: 100,
        },
      }}
      columns={columns}
      data={moduleLovData}
      initialState={{ density: "compact" }} //set the toogle button
      editingMode="modal" //default
      enableRowSelection
      enableMultiRowSelection={false}
      enableColumnOrdering
      // enableEditing="false"
      enableFullScreenToggle={false}
      onRowSelectionChange={setRowSelection}
      state={{ rowSelection }}
      positionToolbarAlertBanner="bottom"
    />
              
            <DialogActions sx={{ p: "1.25rem" }}>
              <Button onClick={handleCloseModal}>Close</Button>
            </DialogActions>
            </DialogContent>
            </Dialog>
            </div>
          )}

          
        </div>
      </>
    );
}

export default Lov
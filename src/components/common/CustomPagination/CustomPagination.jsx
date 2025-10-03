import * as React from 'react';
import {
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';

function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    return (
      <MuiPagination
        color="primary"
        className={className}
        count={pageCount}
        page={page + 1}
        onChange={(event, newPage) => {
          onPageChange(event, newPage - 1);
        }}
        sx={{
            '& .MuiPaginationItem-root.Mui-selected':{
                borderRadius: "6px",
                background: "#5420E8",
                color: "#FFF",
                fontSize: "14px"
            },
            '& .MuiTablePagination-spacer':{
                flex:0,
                width:0
            }
        }}
      />
    );
  }
  
export default function CustomPagination(props) {
return <GridPagination 
ActionsComponent={Pagination} 
{...props} 
labelDisplayedRows={()=>''}
rowsPerPageOptions={[10,20,30]}/>;
}
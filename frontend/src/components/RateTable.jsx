import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { TextFilterModule } from 'ag-grid-community';
import { NumberFilterModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './RateTable.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
]);

const rateFormatter = (params) => {
  return params.value != null ? params.value.toFixed(6) : '';
};

const columnDefs = [
  { field: 'date', headerName: 'Date', filter: 'agTextColumnFilter', pinned: 'left' },
  { field: 'EUR_USD', headerName: 'EUR/USD', filter: 'agNumberColumnFilter', valueFormatter: rateFormatter },
  { field: 'EUR_CAD', headerName: 'EUR/CAD', filter: 'agNumberColumnFilter', valueFormatter: rateFormatter },
  { field: 'USD_EUR', headerName: 'USD/EUR', filter: 'agNumberColumnFilter', valueFormatter: rateFormatter },
  { field: 'CAD_EUR', headerName: 'CAD/EUR', filter: 'agNumberColumnFilter', valueFormatter: rateFormatter },
];

const defaultColDef = {
  flex: 1,
  minWidth: 120,
  filter: true,
  sortable: true,
  resizable: true,
};

const RateTable = ({ rowData, loading }) => {
  if (loading) {
    return (
      <div className="rate-table-container rate-table-loading">
        <span className="spinner" />
        Loading table...
      </div>
    );
  }

  return (
    <div className="rate-table-container">
      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

export default RateTable;

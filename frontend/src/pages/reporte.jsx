import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import { DataTable } from 'primereact/datatable'
import axios from 'axios'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

const Reporte = () => {

  const [Datos, setDatos]= useState([])

  useEffect(()=>{
    let token= localStorage.getItem('token_eleccion_2023_app')
    axios.get(process.env.NEXT_PUBLIC_BACKEND+'controller/total_votos',{
      headers:{
        token_eleccion_2023_app: token
      }
    }).then((result)=>{
      setDatos(result.data)
    })
  })

    const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(Datos);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      saveAsExcelFile(excelBuffer, 'total');
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };

  const HeaderTable=(()=>{
    return(
      <div>
        <Button type="button" icon="pi pi-file-excel" severity="success" onClick={exportExcel}   data-pr-tooltip="XLS" />
      </div>
    )
  })

  return (
    <Sidebar>
      <DataTable value={Datos} header={HeaderTable}>
        <Column field='candidato' header='CANDIDATO' align='center' />
        <Column field='total' header='VOTOS TOTALES ' align='center' />
        <Column field='porcentual' header='VALOR PORCENTUAL ' align='center' />
      </DataTable>
    </Sidebar>
  )
}

export default Reporte

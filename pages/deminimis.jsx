import Layout from "../components/Layout";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function DeMinimis(){
  const [rows, setRows] = useState([]);
  const onFile = async (e)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    if(f.name.endsWith(".csv")){
      Papa.parse(f, { header: true, complete: (res)=> setRows(res.data) });
    } else if (f.name.endsWith(".xlsx") || f.name.endsWith(".xls")){
      const data = await f.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);
      setRows(json);
    } else {
      alert("Carica CSV o Excel.");
    }
  };
  return (
    <Layout>
      <div className="max-w-3xl card">
        <div className="text-xl font-semibold mb-3">Analisi De Minimis / RNA</div>
        <input className="mt-1" type="file" onChange={onFile} />
        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead><tr>{rows[0] && Object.keys(rows[0]).map(k=>(<th key={k} className="text-left py-1 pr-4">{k}</th>))}</tr></thead>
            <tbody>
              {rows.map((r,i)=>(<tr key={i}>{Object.values(r).map((v,j)=>(<td key={j} className="py-1 pr-4">{String(v)}</td>))}</tr>))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">Prossimo step: sincronizza su Google Sheets via API.</p>
      </div>
    </Layout>
  );
}
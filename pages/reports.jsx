import Layout from "@/components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

const obiezioni = [
  { m: "Mag", count: 12 },
  { m: "Giu", count: 10 },
  { m: "Lug", count: 14 },
  { m: "Ago", count: 9 },
  { m: "Set", count: 16 },
];

const engagement = [
  { m: "Mag", v: 0.55 },
  { m: "Giu", v: 0.62 },
  { m: "Lug", v: 0.58 },
  { m: "Ago", v: 0.66 },
  { m: "Set", v: 0.71 },
];

export default function Reports(){
  return (
    <Layout>
      <div className="grid gap-4">
        <div className="text-xl font-semibold">Report</div>
        <div className="card h-64">
          <div className="text-sm mb-2">Trend obiezioni</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={obiezioni}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="m"/><YAxis/><Tooltip/><Bar dataKey="count" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card h-64">
          <div className="text-sm mb-2">Andamento engagement</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagement}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"/><stop offset="95%"/></linearGradient></defs><XAxis dataKey="m"/><YAxis domain={[0,1]}/><Tooltip/><Area dataKey="v" /></AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
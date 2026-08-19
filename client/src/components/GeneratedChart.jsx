import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GeneratedChart = ({ chart }) => {
  if (!chart || !chart.data?.length) return null;

  const {
    type,
    title,
    description,
    xKey,
    yKey,
    data,
  } = chart;

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      {title && (
        <h4 className="text-xl font-semibold mb-2">
          {title}
        </h4>
      )}

      {description && (
        <p className="text-gray-400 mb-5">
          {description}
        </p>
      )}

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} />
            </BarChart>
          ) : type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={yKey}
              />
            </LineChart>
          ) : type === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {data.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey={xKey} />
              <YAxis dataKey={yKey} />
              <Tooltip />
              <Legend />
              <Scatter data={data} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GeneratedChart;
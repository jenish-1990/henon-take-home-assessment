import { useState, useMemo } from 'react';
import useExchangeRates from '../hooks/useExchangeRates';
import { toChartData, toGridRows } from '../utils/transformData';
import Controls from './Controls';
import RateChart from './RateChart';
import RateTable from './RateTable';
import './Dashboard.css';

const formatDate = (date) => date.toISOString().split('T')[0];

const getStartDate = (range) => {
  const start = new Date();
  if (range === '6m') start.setMonth(start.getMonth() - 6);
  else if (range === '1y') start.setFullYear(start.getFullYear() - 1);
  else start.setFullYear(start.getFullYear() - 2);
  return formatDate(start);
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('1y');
  const [selectedCurrencies, setSelectedCurrencies] = useState([
    'EUR_USD', 'EUR_CAD', 'USD_EUR', 'CAD_EUR',
  ]);

  const endDate = formatDate(new Date());
  const startDate = getStartDate(dateRange);

  const { rates, loading, error } = useExchangeRates({
    base: 'EUR',
    symbols: 'USD,CAD',
    startDate,
    endDate,
  });

  const chartData = useMemo(() => {
    if (!rates) return { labels: [], datasets: [] };
    const all = toChartData(rates, ['USD', 'CAD']);
    return {
      ...all,
      datasets: all.datasets.filter((ds) =>
        selectedCurrencies.includes(ds.label.replace('/', '_'))
      ),
    };
  }, [rates, selectedCurrencies]);

  const gridRows = useMemo(() => {
    return rates ? toGridRows(rates) : [];
  }, [rates]);

  const handleCurrencyToggle = (key) => {
    setSelectedCurrencies((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Currency Exchange Dashboard</h1>
      {error && <div className="error-banner">{error}</div>}
      <Controls
        selectedCurrencies={selectedCurrencies}
        onCurrencyToggle={handleCurrencyToggle}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <RateChart data={chartData} loading={loading} />
      <RateTable rowData={gridRows} loading={loading} />
    </div>
  );
};

export default Dashboard;

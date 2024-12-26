import React, { useState, useEffect } from "react";
import { generateStocks } from "./stocks";

const StockTable = () => {
  const [stocks, setStocks] = useState(generateStocks());

  // Simulate real-time updates
  useEffect(() => { 
    const interval = setInterval(() => {
      setStocks(generateStocks());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="stock-table">
      <h2>Live Market Simulation</h2>
      <table className="table-auto w-full text-left bg-gray-800 text-white">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Price ($)</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td>{stock.name}</td>
              <td>{stock.price}</td>
              <td className={stock.change > 0 ? "text-green-600" : "text-red-400"}>
                {stock.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;

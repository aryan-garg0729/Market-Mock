// data/stocks.js
export const generateStocks = () => {
    const stocks = [
      { name: "AAPL", price: Math.random() * 1000, change: (Math.random() - 0.5) * 10 },
      { name: "GOOGL", price: Math.random() * 1500, change: (Math.random() - 0.5) * 10 },
      { name: "MSFT", price: Math.random() * 800, change: (Math.random() - 0.5) * 10 },
      { name: "TSLA", price: Math.random() * 1200, change: (Math.random() - 0.5) * 10 },
    ];
  
    return stocks.map((stock) => ({
      ...stock,
      change: parseFloat(stock.change.toFixed(2)),
      price: parseFloat(stock.price.toFixed(2)),
    }));
  };
  
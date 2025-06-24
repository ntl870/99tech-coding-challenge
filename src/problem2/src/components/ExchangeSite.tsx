import { useExchangeSite } from "../hooks";
import ExchangeForm from "./ExchangeForm";

const ExchangeSite = () => {
  const { currencies, loading, error } = useExchangeSite();

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading exchange rates...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <h3>Error Loading Exchange Rates</h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="exchange-site">
      <div className="container">
        <header className="site-header">
          <h1>Crypto Exchange</h1>
        </header>

        <ExchangeForm currencies={currencies} />
      </div>
    </div>
  );
};

export default ExchangeSite;

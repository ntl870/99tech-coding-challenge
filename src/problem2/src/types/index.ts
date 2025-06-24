export interface ExchangeRate {
  currency: string;
  date: string;
  price: number;
}

export interface Currency {
  symbol: string;
  name: string;
  price: number;
  icon?: string;
}

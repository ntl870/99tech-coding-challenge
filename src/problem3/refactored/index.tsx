import React, { useMemo } from "react";
import { getPriority } from "./tools";
import { usePrices } from "./hooks/usePrices";
import { useWalletBalances } from "./hooks/useWalletBalances";
import { WalletRow } from "./components/WalletRow";

// Assuming these would be imported from appropriate libraries/components
interface BoxProps {
  children?: React.ReactNode;
  className?: string;
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props; // Removed unused 'children' destructuring
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain); // Fixed variable name
        // Fixed logic: keep balances with amount > 0 and priority > -99
        // Simplified nested if statements
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        if (leftPriority > rightPriority) return -1;

        if (rightPriority > leftPriority) return 1;

        return 0; // Added missing return for equal priorities
      });
  }, [balances]); // Removed 'prices' from dependency array since it's not used in computation

  // Now actually using the formatted balances
  // Memoize the formatted balances
  const formattedBalances: FormattedWalletBalance[] = useMemo(
    () =>
      sortedBalances.map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      })),
    [sortedBalances]
  );

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className="row"
        key={balance.currency} // Using currency as unique key instead of index
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;

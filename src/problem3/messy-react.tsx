// MISSING: React import needed for React.FC
// MISSING: useMemo import from React
// MISSING: BoxProps import or definition
interface WalletBalance {
  currency: string;
  amount: number;
  // MISSING: blockchain property used later but not defined in interface
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// ISSUE: BoxProps is not defined/imported
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  // INEFFICIENCY: children is destructured but never used
  const { children, ...rest } = props;
  // MISSING: useWalletBalances hook not imported/defined
  const balances = useWalletBalances();
  // MISSING: usePrices hook not imported/defined
  const prices = usePrices();

  // INEFFICIENCY: This is a constant function, so it should be defined outside of the component
  // don't use any for type
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // BUG: lhsPriority is not defined, should be balancePriority
        // LOGIC ERROR: This filter logic is inverted - should keep balances > 0, not <= 0
        // nested if statements are not good, use && instead
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // else if is not good, use quick return instead
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // BUG: Missing return 0 for equal priorities, will return undefined
      });
    // INEFFICIENCY: prices is in dependency array but not used in the computation
  }, [balances, prices]);

  // INEFFICIENCY: formattedBalances is computed but never used
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // BUG: Using sortedBalances instead of formattedBalances, but trying to access balance.formatted
  // which doesn't exist on WalletBalance type
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        // MISSING: WalletRow component not imported/defined
        // MISSING: classes object not defined
        // ANTI-PATTERN: Using array index as key instead of unique identifier
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

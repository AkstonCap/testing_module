import { listMarket, DEFAULT_MARKET_PAIR } from './listMarket';

export const fetchHighestBid = async (
  inputMarket = DEFAULT_MARKET_PAIR, 
  checkingMarket, 
  setCheckingMarket, 
  setHighestBid, 
  showErrorDialog
) => {
    if (checkingMarket) return;
    try {
      setCheckingMarket(true);
      const pair = inputMarket || DEFAULT_MARKET_PAIR;
      const highestBid = await listMarket(pair, 'bid', 'price', 'desc', 'all', 5);
      setHighestBid(highestBid[0]?.price || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get bid',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
};

export const fetchLowestAsk = async (
  inputMarket = DEFAULT_MARKET_PAIR, 
  checkingMarket, 
  setCheckingMarket, 
  setLowestAsk, 
  showErrorDialog
) => {
    if (checkingMarket) return;
    try {
      setCheckingMarket(true);
      const pair = inputMarket || DEFAULT_MARKET_PAIR;
      const lowestAsk = await listMarket(pair, 'ask', 'price', 'asc', 'all', 5);
      setLowestAsk(lowestAsk[0]?.price || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get ask',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
};
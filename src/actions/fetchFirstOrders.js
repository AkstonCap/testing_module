import { setLowestAsk } from './actionCreators';
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
      const pair = inputMarket;
      const bids = await listMarket(pair, 'bid', 'price', 'desc', 'all', 5);
      setHighestBid((bids[0]?.order.amount / bids[0]?.contract.amount ) || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get bids',
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
      const pair = inputMarket;
      const asks = await listMarket(pair, 'ask', 'price', 'asc', 'all', 5);
      setLowestAsk((asks[0]?.order.amount / asks[0]?.contract.amount ) || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get ask',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
};
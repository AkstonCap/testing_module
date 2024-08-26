import * as TYPE from './types';
import { apiCall } from 'nexus-module';

import { listMarket, DEFAULT_MARKET_PAIR } from './listMarket';

export const fetchLastPrice = async (
    inputMarket = DEFAULT_MARKET_PAIR, 
    checkingMarket, 
    setCheckingMarket, 
    setLastPrice, 
    showErrorDialog
) => {
    if (checkingMarket) return;
    try {
      setCheckingMarket(true);
      const pair = inputMarket;
      const result = await listMarket(pair, 'executed', 'time', 'desc', 'all', 5);
      setLastPrice((result[0]?.order.amount / result[0]?.contract.amount) || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get last price',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
};
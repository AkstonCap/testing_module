import * as TYPE from './types';
import { apiCall } from 'nexus-module';

import { listMarket } from './listMarket';

export const DEFAULT_MARKET_PAIR = 'DIST/NXS';

export const fetchLastPrice = async (inputMarket = DEFAULT_MARKET_PAIR, checkingMarket, setCheckingMarket, setLastPrice, showErrorDialog) => {
    if (checkingMarket) return;
    try {
      setCheckingMarket(true);
      const pair = inputMarket || DEFAULT_MARKET_PAIR;
      const result = await listMarket(pair, 'executed', 1, 'time', '1y');
      setLastPrice(result[0]?.price || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get last price',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
};
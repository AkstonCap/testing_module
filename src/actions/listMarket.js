import * as TYPE from './types';
import { apiCall } from 'nexus-module';

export const DEFAULT_MARKET_PAIR = 'DIST/NXS';

export const listMarket = async (
  marketPair = DEFAULT_MARKET_PAIR, 
  path,  
  sort = 'time',
  asc_desc = 'desc', 
  filter = 'all',
  numOfRes = 0
) => {
  try {
    const params = {
      market: marketPair
    };
    const resultInit = await apiCall('market/list/' + path, params);
    const result = await resultInit.json();
    // const result = [...resultInit.bids, ...resultInit.asks]; // Add this line to combine bids and asks

    console.log('API call result:', result); // Add this line to log the result

    if (!Array.isArray(result)) {
      throw new Error('API call did not return an array');
    }

    const now = Date.now();
    const timeFilters = {
      '1d': now - 24 * 60 * 60 * 1000,
      '1w': now - 7 * 24 * 60 * 60 * 1000,
      '1m': now - 30 * 24 * 60 * 60 * 1000,
      '1y': now - 365 * 24 * 60 * 60 * 1000,
      'all': 0,
    };

    const filteredResult = result.filter((item) => { 
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime > (timeFilters[filter] || 0);
    });

    const sortFunctions = {
      'time': (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      'price': (a, b) => b.price - a.price,
    };
    if (asc_desc === 'asc') {
      sortFunctions.price = (a, b) => a.price - b.price;
      sortFunctions.time = (a, b) => new Date(a.timestamp) - new Date(b.timestamp);
    }

    let sortedResult;
    if (numOfRes > 0) {
      sortedResult = filteredResult.sort(sortFunctions[sort]).slice(0, numOfRes);
    } else if (numOfRes === 0) {
      sortedResult = filteredResult.sort(sortFunctions[sort]);
    } else {
      throw new Error('Invalid number of results');
    }

    return sortedResult;
  } catch (error) {
    console.error('Error listing market:', error);
    throw error;
  }
};
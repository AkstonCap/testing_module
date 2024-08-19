import * as TYPE from './types';
import { apiCall } from 'nexus-module';

export const listMarket = async (marketPair = 'DIST/NXS', path, numOfRes = 10, sort = 'time', filter = '1d') => {
  try {
    const params = {
      market: marketPair
    };
    const result = await apiCall('market/list/' + path, params);

    if (!Array.isArray(result)) {
      throw new Error('API call did not return an array');
    }

    const now = Date.now();
    const yesterday = now - 24 * 60 * 60 * 1000;
    const lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    const lastMonth = now - 30 * 24 * 60 * 60 * 1000;
    const lastYear = now - 365 * 24 * 60 * 60 * 1000;

    const filteredResult = result.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      if (filter === '1d') {
        return itemTime > yesterday;
      } else if (filter === '1w') {
        return itemTime > lastWeek;
      } else if (filter === '1m') {
        return itemTime > lastMonth;
      } else if (filter === '1y') {
        return itemTime > lastYear;
      }
      return true;  // Default case if no filter is applied
    });

    const sortedResult = filteredResult.sort((a, b) => {
      if (sort === 'time') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sort === 'price') {
        return b.price - a.price;
        //} else if (sort === 'NXSamount') {
        //return b.amount - a.amount;
      } else {
        return 0;  // Default case if no sort is applied
      }
    }).slice(0, numOfRes);

    return sortedResult;
  } catch (error) {
    console.error('Error listing market:', error);
    throw error;
  }
};
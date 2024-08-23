import { apiCall } from 'nexus-module';

export const viewMarket = async (marketPair = 'DIST/NXS', path, numOfRes = 10, sort = 'time', filter = '1d') => {
    try {
      setCheckingMarket(true);
      const params = { market: marketPair }
      const result = await apiCall('market/list/' + path, params);
      
      const now = Date.now();
      const timeFilters = {
        '1d': now - 24 * 60 * 60 * 1000,
        '1w': now - 7 * 24 * 60 * 60 * 1000,
        '1m': now - 30 * 24 * 60 * 60 * 1000,
        '1y': now - 365 * 24 * 60 * 60 * 1000,
      };

      const filteredResult = result.filter((item) => { 
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime > (timeFilters[filter] || 0);
      });

      const sortFunctions = {
        'time': (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        'price': (a, b) => b.price - a.price,
      };

      const sortedResult = filteredResult.sort(sortFunctions[sort]).slice(0, numOfRes);

      showSuccessDialog({
        message: `${marketPair} Market ${path}`,
        note: JSON.stringify(sortedResult, null, 2),
      });
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get market data for the chosen parameters',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
  };
import { listMarket, DEFAULT_MARKET_PAIR } from 'actions/listMarket';

export const fetchOrderBook = async (
    inputMarket = DEFAULT_MARKET_PAIR, 
    checkingMarket, 
    setCheckingMarket, 
    setOrderBook,
    setOrderBookBids,
    setOrderBookAsks, 
    showErrorDialog
    ) => {
        if (checkingMarket) return;
        try {
        setCheckingMarket(true);
        const pair = inputMarket;
        const result = await listMarket(pair, 'order', 'time', 'desc', 'all', 0);
        setOrderBook([...result.bids, ...result.asks]);
        setOrderBookBids([...result.bids]);
        const asks = await listMarket(pair, 'asks', 'time', 'asc', 'all', 0);
        setOrderBookAsks([...asks]);
        } catch (error) {
        showErrorDialog({
            message: 'Cannot get order book',
            note: error?.message || 'Unknown error',
        });
        } finally {
        setCheckingMarket(false);
        }
    }
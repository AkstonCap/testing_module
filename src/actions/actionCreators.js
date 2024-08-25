import * as TYPE from './types';

export const showConnections = () => ({
  type: TYPE.SHOW_CONNECTIONS,
});

export const hideConnections = () => ({
  type: TYPE.HIDE_CONNECTIONS,
});

export const updateInput = (inputValue) => ({
  type: TYPE.UPDATE_INPUT,
  payload: inputValue,
});


export const setLastPrice = (price) => ({
  type: 'SET_LAST_PRICE', 
  payload: price 
});

export const setHighestBid = (bid) => ({ 
  type: 'SET_HIGHEST_BID', payload: bid });

export const setLowestAsk = (ask) => ({ 
  type: 'SET_LOWEST_ASK', payload: ask });

export const setBaseTokenVolume = (volume) => ({ 
  type: 'SET_BASE_TOKEN_VOLUME', payload: volume });
export const setOrderTokenVolume = (volume) => ({ 
  type: 'SET_ORDER_TOKEN_VOLUME', payload: volume });
export const setInputBaseToken = (token) => ({ 
  type: 'SET_INPUT_BASE_TOKEN', payload: token });
export const setInputOrderToken = (token) => ({ 
  type: 'SET_INPUT_ORDER_TOKEN', payload: token });
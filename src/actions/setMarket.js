export const setMarketPair = function (orderToken, baseToken) => {
    const marketPair = orderToken + "/" + baseToken;
    return marketPair;
}
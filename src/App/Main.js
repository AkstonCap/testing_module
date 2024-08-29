import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import {
  Panel,
  Switch,
  Tooltip,
  TextField,
  Button,
  FieldSet,
  confirm,
  apiCall,
  showErrorDialog,
  showSuccessDialog,
} from 'nexus-module';

import { updateInputOrderToken, updateInputBaseToken } from 'actions/actionCreators';
import RefreshButton from './RefreshButton';
import { viewMarket } from 'actions/viewMarket';
import { fetchLastPrice } from 'actions/fetchLastPrice';
import { fetchHighestBid, fetchLowestAsk } from 'actions/fetchFirstOrders';
import { fetchVolume } from 'actions/fetchVolume';
import { fetchOrderBook } from 'actions/fetchOrderBook';
import { setMarketPair } from 'actions/setMarketPair';

const DemoTextField = styled(TextField)({
  maxWidth: 300,
});

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust the gap as needed */
`;

const DEFAULT_ORDER_TOKEN = 'DIST';
const DEFAULT_BASE_TOKEN = 'NXS';

export default function Main() {
  const { 
    inputBaseToken, 
    inputOrderToken 
  } = useSelector((state) => ({
    inputBaseToken: state.ui.inputBaseToken,
    inputOrderToken: state.ui.inputOrderToken
  }));
  const dispatch = useDispatch();
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
  if (name === 'orderToken') {
    dispatch(updateInputOrderToken(value));
  } else if (name === 'baseToken') {
    dispatch(updateInputBaseToken(value));
  }
  }, [dispatch]);

  useEffect(() => {
    if (!inputOrderToken) {
      dispatch(updateInputOrderToken(DEFAULT_ORDER_TOKEN));
      marketPair = setMarketPair(
        DEFAULT_ORDER_TOKEN, 
        DEFAULT_BASE_TOKEN,
        setMarketPairState 
      );
    }
    if (!inputBaseToken) {
      dispatch(updateInputBaseToken(DEFAULT_BASE_TOKEN));
      marketPair = setMarketPair(
        DEFAULT_ORDER_TOKEN, 
        DEFAULT_BASE_TOKEN,
        setMarketPairState 
      );
    }
  }, [dispatch, inputOrderToken, inputBaseToken]);
  
  const [lastPrice, setLastPrice] = useState('N/A');
  const [highestBid, setHighestBid] = useState('N/A');
  const [lowestAsk, setLowestAsk] = useState('N/A');
  const [baseToken, setBaseToken] = useState('');
  const [orderToken, setOrderToken] = useState('');
  const [orderTokenVolume, setOrderTokenVolume] = useState('N/A');
  const [baseTokenVolume, setBaseTokenVolume] = useState('N/A');
  const [checkingMarket, setCheckingMarket] = useState(false);
  const [marketPair, setMarketPairState] = useState('');
  const [orderBook, setOrderBook] = useState([]);
  const [orderBookBids, setOrderBookBids] = useState([]);
  const [orderBookAsks, setOrderBookAsks] = useState([]);

  const handleRefreshClick = () => {
    setOrderToken(inputOrderToken);
    setBaseToken(inputBaseToken);
    const newMarketPair = `${orderToken}/${baseToken}`;
    setMarketPairState(newMarketPair);
    fetchLastPrice(marketPair, checkingMarket, 
      setCheckingMarket, setLastPrice, showErrorDialog);
    fetchHighestBid(marketPair, setHighestBid, showErrorDialog);
    fetchLowestAsk(marketPair, setLowestAsk, showErrorDialog);
    fetchVolume(marketPair, checkingMarket, setCheckingMarket, 
      setOrderTokenVolume, setBaseTokenVolume, showErrorDialog, '1y');
    fetchOrderBook(marketPair, checkingMarket, setCheckingMarket, 
      setOrderBook, setOrderBookBids, setOrderBookAsks, showErrorDialog);
  };

  const renderTableRows = (data) => {
    return data.slice(0, 5).map((item, index) => (
      <tr key={index}>
        <td>{(item.order.amount / item.contract.amount)}</td>
        <td>{item.order.amount}</td>
        <td>{item.contract.amount}</td>
      </tr>
    ));
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, auto)',
    gap: '10px' // Adjust the gap as needed
  };

  return (
    <Panel title={"DEX Module"} icon={{ url: 'react.svg', id: 'icon' }}>
      <div className="text-center">
        <ButtonContainer>
          <DemoTextField
            name="orderToken"
            value={inputOrderToken}
            onChange={handleChange}
            placeholder="Type order token here"
          />
          /
          <DemoTextField
            name="baseToken"
            value={inputBaseToken}
            onChange={handleChange}
            placeholder="Type base token here"
          />
          <RefreshButton onClick={
            handleRefreshClick
            } disabled={checkingMarket} />
        </ButtonContainer>
      </div>

      <div className="DEX">
        <FieldSet legend={`${marketPair}`}>
          <p>
            <Button onClick={() => viewMarket(
              marketPair, 'executed', 10, 'time', '1y', setCheckingMarket
              )} disabled={checkingMarket}>
              View {marketPair} transactions
            </Button>{' '}
            
            <Button onClick={() => viewMarket(
              marketPair, 'order', 10, 'time', '1y', setCheckingMarket
              )} disabled={checkingMarket}>
              View {marketPair} orders
            </Button>{' '}
          </p>
          <div style={gridStyle}>
            <p>Last Price: {lastPrice} {baseToken}</p>
            
            <p>Bid: {highestBid} {baseToken}</p>
            
            <p>Ask: {lowestAsk} {baseToken}</p>
            
            <p>1yr Volume: {baseTokenVolume} {baseToken}</p>
           
            <p>1yr Volume: {orderTokenVolume} {orderToken}</p>
           
          </div>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Order token amount</th>
                <th>Base token amount</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows(orderBookBids)}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Order token amount</th>
                <th>Base token amount</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows(orderBookAsks)}
            </tbody>
          </table>
        </FieldSet>
      </div>
    </Panel>
  );
}

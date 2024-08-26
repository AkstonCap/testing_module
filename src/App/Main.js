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

import { updateInput } from 'actions/actionCreators';
import { listMarket } from 'actions/listMarket';
import RefreshButton from './RefreshButton';
import { viewMarket } from 'actions/viewMarket';
import { fetchLastPrice } from 'actions/fetchLastPrice';
import { fetchHighestBid, fetchLowestAsk } from 'actions/fetchFirstOrders';
import { fetchVolume } from 'actions/fetchVolume';
import { setMarketPair } from 'actions/setMarket';
import { fetchOrderBook } from 'actions/fetchOrderBook';

const DemoTextField = styled(TextField)({
  maxWidth: 400,
});

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust the gap as needed */
`;

const DEFAULT_MARKET_PAIR = 'DIST/NXS';
const DEFAULT_ORDER_TOKEN = 'DIST';
const DEFAULT_BASE_TOKEN = 'NXS';

export default function Main() {
  const { inputMarket, 
    inputBaseToken, 
    inputOrderToken 
  } = useSelector((state) => ({ 
    inputMarket: state.ui.inputValue,
    inputBaseToken: state.ui.inputBaseToken,
    inputOrderToken: state.ui.inputOrderToken
  }));
  const dispatch = useDispatch();
  const handleChange = useCallback((e) => {
    dispatch(updateInput(e.target.value));
  }, [dispatch]);

  useEffect(() => {
    if (!inputMarket) {
      dispatch(updateInput(DEFAULT_MARKET_PAIR));
    }
    if (!inputOrderToken) {
      dispatch(updateInput(DEFAULT_ORDER_TOKEN));
    }
    if (!inputBaseToken) {
      dispatch(updateInput(DEFAULT_BASE_TOKEN));
    }
  }, [dispatch, inputMarket, inputOrderToken, inputBaseToken]);
  
  const [lastPrice, setLastPrice] = useState('N/A');
  const [highestBid, setHighestBid] = useState('N/A');
  const [lowestAsk, setLowestAsk] = useState('N/A');
  const [orderTokenVolume, setOrderTokenVolume] = useState('N/A');
  const [baseTokenVolume, setBaseTokenVolume] = useState('N/A');
  const [checkingMarket, setCheckingMarket] = useState(false);
  const [marketPair, setMarketPairState] = useState('');
  const [orderBook, setOrderBook] = useState([]);
  const [orderBookBids, setOrderBookBids] = useState([]);
  const [orderBookAsks, setOrderBookAsks] = useState([]);

  const handleRefreshClick = () => {
    setMarketPair(inputOrderToken, inputBaseToken, setMarketPairState);
    fetchLastPrice(inputMarket, checkingMarket, 
      setCheckingMarket, setLastPrice, showErrorDialog);
    fetchHighestBid(inputMarket, setHighestBid, showErrorDialog);
    fetchLowestAsk(inputMarket, setLowestAsk, showErrorDialog);
    fetchVolume(inputMarket, checkingMarket, setCheckingMarket, 
      setOrderTokenVolume, setBaseTokenVolume, showErrorDialog, '1y');
    fetchOrderBook(inputMarket, checkingMarket, setCheckingMarket, 
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
            value={inputMarket}
            onChange={handleChange}
            placeholder="Type market pair here"
          />
          <DemoTextField
            value={inputOrderToken}
            onChange={handleChange}
            placeholder="Type order token here"
          />
          /
          <DemoTextField
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
            <Button onClick={() => viewMarket(marketPair, 'executed', 10, 'time', '1y', setCheckingMarket)} disabled={checkingMarket}>
              View {inputMarket || DEFAULT_MARKET_PAIR} transactions
            </Button>{' '}
            
            <Button onClick={() => viewMarket(marketPair, 'order', 10, 'time', '1y', setCheckingMarket)} disabled={checkingMarket}>
              View {inputMarket || DEFAULT_MARKET_PAIR} orders
            </Button>{' '}
          </p>
          <div style={gridStyle}>
            <p>Last Price: {lastPrice} {inputBaseToken}</p>
            
            <p>Bid: {highestBid} {inputBaseToken}</p>
            
            <p>Ask: {lowestAsk} {inputBaseToken}</p>
            
            <p>1yr Volume: {baseTokenVolume} {inputBaseToken}</p>
           
            <p>1yr Volume: {orderTokenVolume} {inputOrderToken}</p>
           
          </div>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Token amount</th>
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
                <th>Token amount</th>
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

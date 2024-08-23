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

const DemoTextField = styled(TextField)({
  maxWidth: 400,
});

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust the gap as needed */
`;

const DEFAULT_MARKET_PAIR = 'DIST/NXS';

export default function Main() {
  const inputMarket = useSelector((state) => state.ui.inputValue);
  const dispatch = useDispatch();
  const handleChange = useCallback((e) => {
    dispatch(updateInput(e.target.value));
  }, [dispatch]);
  
  const [lastPrice, setLastPrice] = useState('N/A');
  const [highestBid, setHighestBid] = useState('N/A');
  const [lowestAsk, setLowestAsk] = useState('N/A');
  const [volume, setVolume] = useState('N/A');
  const [checkingMarket, setCheckingMarket] = useState(false);

  const handleRefreshClick = () => {
    fetchLastPrice(inputMarket, checkingMarket, 
      setCheckingMarket, setLastPrice, showErrorDialog);
    fetchHighestBid(inputMarket, setHighestBid, showErrorDialog);
    fetchLowestAsk(inputMarket, setLowestAsk, showErrorDialog);
  };
  
  return (
    <Panel title="${inputMarket || DEFAULT_MARKET_PAIR} Market" icon={{ url: 'react.svg', id: 'icon' }}>
      <div className="text-center">
        <ButtonContainer>
          <DemoTextField
            value={inputMarket}
            onChange={handleChange}
            placeholder="Type market pair here"
          />
          <RefreshButton onClick={
            handleRefreshClick
            } disabled={checkingMarket} />
        </ButtonContainer>
      </div>

      <div className="DEX">
        <FieldSet legend="Nexus DEX">
          <p>
            <Button onClick={() => viewMarket(inputMarket, 'executed', 10, 'time', '1y')} disabled={checkingMarket}>
              View {inputMarket || DEFAULT_MARKET_PAIR} transactions
            </Button>{' '}
            
            <Button onClick={() => viewMarket(inputMarket, 'order', 10, 'time', '1y')} disabled={checkingMarket}>
              View {inputMarket || DEFAULT_MARKET_PAIR} orders
            </Button>{' '}
          </p>
          <p>
            Last Price: {lastPrice}
            {' '}
            Bid: {highestBid}
            {' '}
            Ask: {lowestAsk}
            {' '}
            Volume: {volume}
            {' '}
          </p>
          <p>
            {' '}
          </p>
        </FieldSet>
      </div>
    </Panel>
  );
}

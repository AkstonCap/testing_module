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
  }, [dispatch, inputMarket]);
  
  const [lastPrice, setLastPrice] = useState('N/A');
  const [highestBid, setHighestBid] = useState('N/A');
  const [lowestAsk, setLowestAsk] = useState('N/A');
  const [orderTokenVolume, setOrderTokenVolume] = useState('N/A');
  const [baseTokenVolume, setBaseTokenVolume] = useState('N/A');
  const [checkingMarket, setCheckingMarket] = useState(false);

  const handleRefreshClick = () => {
    fetchLastPrice(inputMarket, checkingMarket, 
      setCheckingMarket, setLastPrice, showErrorDialog);
    fetchHighestBid(inputMarket, setHighestBid, showErrorDialog);
    fetchLowestAsk(inputMarket, setLowestAsk, showErrorDialog);
    fetchVolume(inputMarket, checkingMarket, setCheckingMarket, 
      setOrderTokenVolume, setBaseTokenVolume, showErrorDialog, '1y');
  };
  
  return (
    <Panel title={`${inputMarket} Market`} icon={{ url: 'react.svg', id: 'icon' }}>
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
            Last Price: {lastPrice} {inputBaseToken}
            {' '}
            Bid: {highestBid} {inputBaseToken}
            {' '}
            Ask: {lowestAsk} {inputBaseToken}
            {' '}
            1yr Volume: {baseTokenVolume} {inputBaseToken}
            {' '}
            1yr Volume: {orderTokenVolume} {inputOrderToken}
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

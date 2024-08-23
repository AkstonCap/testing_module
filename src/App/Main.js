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
  const [checkingMarket, setCheckingMarket] = useState(false);
  
  const viewMarket = async (marketPair = 'DIST/NXS', path, numOfRes = 10, sort = 'time', filter = '1d') => {
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
        'NXSamount': (a, b) => b.amount - a.amount,
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

  const fetchLastPrice = async () => {
    if (checkingMarket) return;
    try {
      setCheckingMarket(true);
      const pair = inputMarket || DEFAULT_MARKET_PAIR;
      const result = await listMarket(pair, 'executed', 1, 'time', '1y');
      setLastPrice(result[0]?.price || 'N/A');
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get last price',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
  };

  return (
    <Panel title="DEX Module" icon={{ url: 'react.svg', id: 'icon' }}>
      <div className="text-center">
        <ButtonContainer>
          <DemoTextField
            value={inputMarket}
            onChange={handleChange}
            placeholder="Type market pair here"
          />
          <RefreshButton onClick={fetchLastPrice} disabled={checkingMarket} />
        </ButtonContainer>
      </div>

      <div className="DEX">
        <FieldSet legend="Nexus DEX">
          <p>
            The Nexus DEX is a decentralized exchange built into the Nexus
            Wallet. It allows users to trade Nexus (NXS) and other assets
            directly from their wallets.
          </p>
          <p>
            <Button onClick={() => viewMarket(inputMarket, 'executed', 10, 'time', '1y')} disabled={checkingMarket}>
              View ${inputMarket || DEFAULT_MARKET_PAIR} transactions
            </Button>{' '}
            
            <Button onClick={() => viewMarket(inputMarket, 'order', 10, 'time', '1y')} disabled={checkingMarket}>
              View ${inputMarket || DEFAULT_MARKET_PAIR} orders
            </Button>{' '}
          </p>
          <p>
            Last Price: {lastPrice}
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

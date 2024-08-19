import { useState } from 'react';
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

const DemoTextField = styled(TextField)({
  maxWidth: 400,
});

const DEFAULT_MARKET_PAIR = 'DIST/NXS';

export default function Main() {
  const inputMarket = useSelector((state) => state.ui.inputValue);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    dispatch(updateInput(e.target.value));
  };
  
  const [checkingMetrics, setCheckingMetrics] = useState(false);
  const [lastPrice, setLastPrice] = useState('N/A');
  const [checkingMarket, setCheckingMarket] = useState(false);

  const viewMetrics = async () => {
    try {
      setCheckingMetrics(true);
      const result = await apiCall('system/get/metrics');
      showSuccessDialog({
        message: 'Tritium Metrics',
        note: JSON.stringify(result, null, 2),
      });
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get metrics',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMetrics(false);
    }
  };
  
  const viewMarket = async (marketPair = 'DIST/NXS', path, numOfRes = 10, sort = 'time', filter = '1d') => {
    try {
      setCheckingMarket(true);
      const params = { market: marketPair }
      const result = await apiCall('market/list/' + path, params);
      
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
        } else if (sort === 'NXSamount') {
          return b.amount - a.amount;
        } else {
          return 0;  // Default case if no sort is applied
        }
      }).slice(0, numOfRes);

      showSuccessDialog({
        message: marketPair + ' Market ' + path,
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

  useEffect(() => {
    const fetchLastPrice = async () => {
      try {
        const pair = inputMarket || DEFAULT_MARKET_PAIR;
        const result = await listMarket(pair, 'executed', 1, 'time', '1y');
        setLastPrice(result[0]?.price || 'N/A');
      } catch (error) {
        showErrorDialog({
          message: 'Cannot get last price',
          note: error?.message || 'Unknown error',
        });
      }
    };
    fetchLastPrice();
  }, [inputMarket]);

  return (
    <Panel title="DEX Module" icon={{ url: 'react.svg', id: 'icon' }}>
      <div className="text-center">
        <DemoTextField
          value={inputMarket}
          onChange={handleChange}
          placeholder="Type market pair here"
        />
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

      <div className="mt2">
        <FieldSet legend="API calls">
          <p>
            You can make API calls from your module to the Nexus Core using{' '}
            <Button
              skin="hyperlink"
              as="a"
              href="https://github.com/Nexusoft/NexusInterface/blob/master/docs/Modules/nexus-global-variable.md#apicall"
            >
              apiCall
            </Button>{' '}
            utility function. Click the button below to view blockchain metrics.
          </p>
          <Button onClick={viewMetrics} disabled={checkingMetrics}>
            View blockchain metrics
          </Button>{' '}
        </FieldSet>
      </div>
    </Panel>
  );
}

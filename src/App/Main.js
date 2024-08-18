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

import {
  showConnections,
  hideConnections,
  updateInput,
} from 'actions/actionCreators';

const DemoTextField = styled(TextField)({
  maxWidth: 400,
});

export default function Main() {
  const coreInfo = useSelector((state) => state.nexus.coreInfo);
  const userStatus = useSelector((state) => state.nexus.userStatus);
  const showingConnections = useSelector(
    (state) => state.settings.showingConnections
  );
  const inputValue = useSelector((state) => state.ui.inputValue);
  const dispatch = useDispatch();
  const confirmToggle = async () => {
    const question = showingConnections
      ? 'Hide number of connections?'
      : 'Show number of connections?';

    const agreed = await confirm({ question });
    if (agreed) {
      if (showingConnections) {
        dispatch(hideConnections());
      } else {
        dispatch(showConnections());
      }
    }
  };
  const handleChange = (e) => {
    dispatch(updateInput(e.target.value));
  };
  const [checkingMetrics, setCheckingMetrics] = useState(false);
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
  const [checkingMarket, setCheckingMarket] = useState(false);
  const viewMarket = async () => {
    try {
      setCheckingMarket(true);
      const params = {
        market: 'DIST/NXS',
      }
      const result = await apiCall('market/list/executed', params);
      showSuccessDialog({
        message: 'DIST/NXS Market',
        note: JSON.stringify(result, null, 2),
      });
    } catch (error) {
      showErrorDialog({
        message: 'Cannot get market data',
        note: error?.message || 'Unknown error',
      });
    } finally {
      setCheckingMarket(false);
    }
  };

  return (
    <Panel title="Testing Module" icon={{ url: 'react.svg', id: 'icon' }}>
      <div className="text-center">
        Check out the{' '}
        <Button
          skin="hyperlink"
          as="a"
          href="https://github.com/Nexusoft/NexusInterface/tree/master/docs/Modules"
        >
          Developer's guide to Nexus Wallet Module
        </Button>{' '}
        for documentation and API reference.
      </div>

      <div className="DEX">
        <FieldSet legend="Nexus DEX">
          <DemoTextField
            value={inputValue}
            onChange={handleChange}
            placeholder="Type anything here"
          />
          <p>
            {' '}
          </p>
          <Button onClick={viewMarket} disabled={checkingMarket}>
            View DIST/NXS transactions
          </Button>{' '}
          <p>
            {' '}
          </p>
            {' '}
          <p>
            The Nexus DEX is a decentralized exchange built into the Nexus
            Wallet. It allows users to trade Nexus (NXS) and other assets
            directly from their wallets.
          </p>
          <p>
            {' '}
          </p>
        </FieldSet>
      </div>

      <div className="mt2 flex center">
        <FieldSet legend="Module storage">
          <p>
            <strong>Module storage</strong> is a feature that allows modules to
            save data (module's settings for example) into a file so that it
            won't be lost when user closes their wallet.
          </p>
          <p>
            The on/off state of the switch below will be saved to a file using{' '}
            <Button
              skin="hyperlink"
              as="a"
              href="https://github.com/Nexusoft/NexusInterface/blob/master/docs/Modules/nexus-global-variable.md#updatestorage"
            >
              updateStorage
            </Button>{' '}
            utility function. Try switching it and restart your wallet to see if
            the switch state is retained.
          </p>
          <DemoTextField
            value={inputValue}
            onChange={handleChange}
            placeholder="Type anything here"
          />
          <Button onClick={viewMarket} disabled={checkingMarket}>
            View DIST/NXS transactions
          </Button>{' '}
          <Tooltip.Trigger
            position="right"
            tooltip="Click me then restart wallet"
          >
            <Switch checked={showingConnections} onChange={confirmToggle} />
          </Tooltip.Trigger>
        </FieldSet>
      </div>

      <div className="mt2">
        <FieldSet legend="Module state">
          <p>
            Since your module is embedded inside a &lt;webview&gt; tag, normally
            when user navigates away from your module page, the &lt;Webview&gt;
            will be unmounted and all your module state will be lost.{' '}
            <strong>Module state</strong> is a feature that allows modules to
            save temporary state data on the base wallet so that it won't be
            lost when user navigates away from the module.
          </p>
          <p>
            The content of the textbox below will be saved to base wallet's
            state using{' '}
            <Button
              skin="hyperlink"
              as="a"
              href="https://github.com/Nexusoft/NexusInterface/blob/master/docs/Modules/nexus-global-variable.md#updatestate"
            >
              updateState
            </Button>{' '}
            utility function. Try filling it out then switch to Overview and
            switch back to see if the content is still there.
          </p>
          <DemoTextField
            value={inputValue}
            onChange={handleChange}
            placeholder="Type anything here"
          />
        </FieldSet>
      </div>

      <div className="mt2 flex center">
        <FieldSet legend="Live updated data">
          <p>
            Core information, user status, local address book, wallet theme and
            settings will be fed into your module when your module is
            initialized and when those data are changed.
          </p>
          {!!showingConnections && (
            <div className="mt1">
              Core connections:{' '}
              <strong>
                {coreInfo ? coreInfo.connections : 'Not connected'}
              </strong>
            </div>
          )}
          <div>
            User status:{' '}
            <strong>{userStatus ? 'Logged in' : 'Not logged in'}</strong>
          </div>
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

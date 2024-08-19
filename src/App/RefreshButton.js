import { keyframes } from '@emotion/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon, Tooltip, Button } from 'nexus-module';


const spin = keyframes`
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
`;

function useRefreshMarket(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const refreshMarket = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return [refreshing, refreshMarket];
}

export default function RefreshButton( { onRefresh }) {
  const [refreshing, refreshMarket] = useRefreshMarket(onRefresh);
  return (
    <Tooltip.Trigger tooltip="Refresh">
      <Button square skin="plain" onClick={refreshMarket}>
        <Icon
          icon={{ url: 'syncing.svg', id: 'icon' }}
          style={
            refreshing
              ? {
                  animation: `${spin} 2s linear infinite`,
                }
              : undefined
          }
        />
      </Button>
    </Tooltip.Trigger>
  );
}

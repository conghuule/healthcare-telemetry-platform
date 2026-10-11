import { useCallback, useEffect, useState } from 'react';
import { getDevices } from '../api/telemetryApi.js';

export function useDevices() {
  const [state, setState] = useState({ devices: [], loading: true, error: '' });

  const refresh = useCallback(async () => {
    try {
      const devices = await getDevices();
      setState({ devices, loading: false, error: '' });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { ...state, refresh };
}

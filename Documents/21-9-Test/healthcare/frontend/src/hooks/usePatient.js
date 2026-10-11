import { useCallback, useEffect, useState } from 'react';
import { getPatient } from '../api/telemetryApi.js';

export function usePatient(patientId) {
  const [state, setState] = useState({ patient: null, loading: true, error: '' });

  const refresh = useCallback(async () => {
    try {
      const patient = await getPatient(patientId);
      setState({ patient, loading: false, error: '' });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  }, [patientId]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 3000);
    return () => clearInterval(timer);
  }, [refresh]);

  return { ...state, refresh };
}

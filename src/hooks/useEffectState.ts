import { useState, useCallback, useEffect } from 'react';

export type Trigger = (callback?: VoidFunction) => void;

/**
 * Trigger a callback on state change
 */
export default function useEffectState(): Trigger {
  const [effectId, setEffectId] = useState<{
    id: number;
    callback: VoidFunction | null;
  }>({
    id: 0,
    callback: null,
  });

  const update = useCallback((callback?: VoidFunction) => {
    setEffectId(({ id }) => ({
      id: id + 1,
      callback,
    }));
  }, []);

  useEffect(() => {
    effectId.callback?.();
  }, [effectId]);

  return update;
}

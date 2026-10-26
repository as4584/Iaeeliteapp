import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { type RequestDraft, emptyDraft } from './model';

// Draft lives in memory only — no PII is persisted to disk (see docs/ARCHITECTURE.md §Security).
type Ctx = {
  draft: RequestDraft;
  /** Bumps whenever the flow must restart at step 1 (after a reset or a new service pick). */
  generation: number;
  update: (patch: Partial<RequestDraft>) => void;
  reset: () => void;
  /** Start a request from a service detail screen. */
  startWith: (serviceId: string) => void;
};

const RequestContext = createContext<Ctx | null>(null);

export function RequestProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<RequestDraft>(emptyDraft);
  const [generation, setGeneration] = useState(0);
  const update = useCallback((patch: Partial<RequestDraft>) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => {
    setDraft(emptyDraft);
    setGeneration((g) => g + 1);
  }, []);
  // Picking a service from its detail page restarts at "What" with only that service, keeping contact details.
  const startWith = useCallback((serviceId: string) => {
    setDraft((d) => ({ ...d, serviceIds: [serviceId] }));
    setGeneration((g) => g + 1);
  }, []);
  const value = useMemo(
    () => ({ draft, generation, update, reset, startWith }),
    [draft, generation, update, reset, startWith],
  );
  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest(): Ctx {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequest must be used inside RequestProvider');
  return ctx;
}

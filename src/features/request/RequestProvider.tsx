import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { type RequestDraft, emptyDraft } from './model';

// Draft lives in memory only — no PII is persisted to disk (see docs/ARCHITECTURE.md §Security).
type Ctx = {
  draft: RequestDraft;
  update: (patch: Partial<RequestDraft>) => void;
  reset: () => void;
  /** Start a request from a service detail screen. */
  startWith: (serviceId: string) => void;
};

const RequestContext = createContext<Ctx | null>(null);

export function RequestProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<RequestDraft>(emptyDraft);
  const update = useCallback((patch: Partial<RequestDraft>) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft(emptyDraft), []);
  const startWith = useCallback(
    (serviceId: string) =>
      setDraft((d) => ({ ...d, serviceIds: d.serviceIds.includes(serviceId) ? d.serviceIds : [serviceId] })),
    [],
  );
  const value = useMemo(() => ({ draft, update, reset, startWith }), [draft, update, reset, startWith]);
  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest(): Ctx {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequest must be used inside RequestProvider');
  return ctx;
}

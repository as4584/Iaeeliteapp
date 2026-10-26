import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import {
  type ContentSource,
  fetchRemoteContent,
  getBundledContent,
  readCachedContent,
} from './repository';
import type { Collection, Content, Service } from './schema';

type ContentState = { content: Content; source: ContentSource };

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({ children }: PropsWithChildren) {
  // Render bundled content on the very first frame — the app is never blank.
  const [state, setState] = useState<ContentState>(() => ({
    content: getBundledContent(),
    source: 'bundled',
  }));

  useEffect(() => {
    let alive = true;
    (async () => {
      const cached = await readCachedContent();
      // A cache older than the bundled copy (e.g. after an app update) is stale.
      if (alive && cached && cached.updatedAt >= getBundledContent().updatedAt) {
        setState({ content: cached, source: 'cache' });
      }
      const remote = await fetchRemoteContent();
      if (alive && remote.ok) setState({ content: remote.content, source: 'remote' });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent(): Content {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx.content;
}

export function useContentSource(): ContentSource {
  return useContext(ContentContext)?.source ?? 'bundled';
}

export function sortServices(services: Service[]): Service[] {
  return [...services].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function useCollections(): Collection[] {
  const { collections } = useContent();
  return useMemo(() => [...collections].sort((a, b) => a.sortOrder - b.sortOrder), [collections]);
}

export function useServicesIn(collectionId: string): Service[] {
  const { services } = useContent();
  return useMemo(
    () => sortServices(services.filter((s) => s.collection === collectionId)),
    [services, collectionId],
  );
}

export function useService(id: string | undefined): Service | undefined {
  const { services } = useContent();
  return services.find((s) => s.id === id);
}

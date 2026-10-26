import { z } from 'zod';

/** Major version this binary understands. Remote content with another major is ignored. */
export const SUPPORTED_SCHEMA_MAJOR = 1;

const safeUrl = z
  .string()
  .refine((u) => /^(https:|mailto:|tel:)/.test(u), 'Only https:, mailto: and tel: links are allowed');

/** `asset:<key>` (bundled) or an https URL (hosted). */
export const imageRef = z
  .string()
  .refine((s) => s.startsWith('asset:') || s.startsWith('https://'), 'Image must be asset:<key> or https://');

export const badgeKind = z.enum(['flagship', 'rapid', 'licensed']);
export type BadgeKind = z.infer<typeof badgeKind>;

export const serviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  collection: z.string(),
  title: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().optional(),
  note: z.string().optional(),
  image: imageRef,
  badge: z.object({ kind: badgeKind, label: z.string().min(1).max(20) }).optional(),
  featured: z.boolean().default(false),
  requestable: z.boolean().default(true),
  sortOrder: z.number().default(0),
});
export type Service = z.infer<typeof serviceSchema>;

export const collectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  overline: z.string(),
  intro: z.string(),
  image: imageRef,
  sortOrder: z.number().default(0),
});
export type Collection = z.infer<typeof collectionSchema>;

export const contentSchema = z.object({
  schemaVersion: z.string().regex(/^\d+\.\d+$/),
  updatedAt: z.string(),
  brand: z.object({
    name: z.string(),
    shortName: z.string(),
    division: z.string(),
    motto: z.string(),
  }),
  hero: z.object({
    overline: z.string(),
    headline: z.string(),
    accentWord: z.string(),
    subhead: z.string(),
    primaryCta: z.string(),
    film: z.array(z.object({ title: z.string(), video: z.string(), poster: imageRef })).default([]),
  }),
  announcement: z
    .object({ text: z.string(), active: z.boolean() })
    .refine((a) => !a.active || a.text.trim().length > 0, 'An active announcement needs text')
    .optional(),
  contact: z.object({
    email: z.string().email(),
    phoneDisplay: z.string(),
    phoneE164: z.string().regex(/^\+\d{8,15}$/),
    responseNote: z.string(),
    region: z.string(),
    confidentiality: z.string(),
  }),
  socials: z.array(
    z.object({ id: z.string(), label: z.string(), handle: z.string(), url: safeUrl }),
  ),
  standard: z.object({ overline: z.string(), title: z.string(), body: z.string() }),
  mission: z.object({ overline: z.string(), title: z.string(), body: z.string(), quote: z.string() }),
  scale: z.array(z.object({ value: z.string(), label: z.string(), detail: z.string() })),
  process: z.array(z.object({ step: z.string(), title: z.string(), body: z.string() })).min(1),
  field: z.array(z.object({ image: imageRef, caption: z.string() })),
  collections: z.array(collectionSchema).min(1),
  services: z.array(serviceSchema).min(1),
  requestOptions: z.object({
    fullEngagementId: z.string(),
    disclaimer: z.string(),
  }),
});
export type Content = z.infer<typeof contentSchema>;

export type ParseResult = { ok: true; content: Content } | { ok: false; reason: string };

export function parseContent(raw: unknown): ParseResult {
  const result = contentSchema.safeParse(raw);
  if (!result.success) {
    const issue = result.error.issues[0];
    return { ok: false, reason: `${issue?.path.join('.') || 'root'}: ${issue?.message}` };
  }
  const major = Number(result.data.schemaVersion.split('.')[0]);
  if (major !== SUPPORTED_SCHEMA_MAJOR) {
    return { ok: false, reason: `Unsupported schema major ${major}` };
  }
  const collectionIds = new Set(result.data.collections.map((c) => c.id));
  const orphan = result.data.services.find((s) => !collectionIds.has(s.collection));
  if (orphan) return { ok: false, reason: `Service ${orphan.id} references unknown collection` };
  const ids = result.data.services.map((s) => s.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) return { ok: false, reason: `Duplicate service id ${dup}` };
  if (!ids.includes(result.data.requestOptions.fullEngagementId)) {
    return { ok: false, reason: 'requestOptions.fullEngagementId does not match a service' };
  }
  return { ok: true, content: result.data };
}

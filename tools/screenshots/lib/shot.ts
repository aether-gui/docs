import fs from 'node:fs';
import path from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { env } from './env';

export type Track = 'gui' | 'iso' | 'bootstrap';

export interface ShotOptions {
  // Capture only this element instead of the viewport.
  locator?: Locator;
  fullPage?: boolean;
  // Elements to paint over (hostnames, addresses, tokens).
  mask?: Locator[];
  clip?: { x: number; y: number; width: number; height: number };
}

// Writes src/assets/screenshots/<track>/<name>.png after fonts and network
// activity settle. Names follow <page-slug>-<nn>-<element> so a screenshot's
// home page is obvious from its filename.
export async function shot(page: Page, track: Track, name: string, o: ShotOptions = {}) {
  await page.evaluate(() => (document as any).fonts?.ready);
  await page.waitForLoadState('networkidle');
  const file = path.join(env.shotDir, track, `${name}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const target = o.locator ?? page;
  await target.screenshot({
    path: file,
    animations: 'disabled',
    caret: 'hide',
    scale: 'device',
    fullPage: o.fullPage ?? false,
    mask: o.mask,
    maskColor: '#e2e6ec',
    clip: o.clip,
  } as any);
  return file;
}

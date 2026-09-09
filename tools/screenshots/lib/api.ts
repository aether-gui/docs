import type { APIRequestContext } from '@playwright/test';

// Thin helpers over the aether-ops REST API used to put the daemon into a known
// state before a capture and to wait for long operations by polling.

const DONE = /^(completed|succeeded|success|done|finished)$/i;
const FAILED = /^(failed|error|errored|cancelled|canceled)$/i;

export async function resetWizard(api: APIRequestContext) {
  const res = await api.delete('/api/v1/wizard');
  if (!res.ok()) throw new Error(`wizard reset failed: ${res.status()} ${await res.text()}`);
}

export async function wizardState(api: APIRequestContext) {
  return (await api.get('/api/v1/wizard')).json();
}

export async function listNodes(api: APIRequestContext) {
  return (await api.get('/api/v1/nodes')).json() as Promise<Array<Record<string, any>>>;
}

export async function deleteNode(api: APIRequestContext, id: string) {
  await api.delete(`/api/v1/nodes/${id}`);
}

// Polls an OnRamp task until it reaches a terminal status. Deploys run for
// tens of minutes, so the budget defaults to an hour.
export async function waitForTask(
  api: APIRequestContext,
  id: string,
  { timeoutMs = 60 * 60_000, everyMs = 10_000 } = {},
) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const task = await (await api.get(`/api/v1/onramp/tasks/${id}`)).json();
    if (DONE.test(task.status)) return task;
    if (FAILED.test(task.status)) throw new Error(`task ${id} ${task.status}: ${task.output?.slice(-2000)}`);
    await new Promise((r) => setTimeout(r, everyMs));
  }
  throw new Error(`task ${id} timed out`);
}

// Polls an apply run (a batch of component actions submitted by the wizard's
// Deploy step) until every action is terminal.
export async function waitForApplyRun(
  api: APIRequestContext,
  id: string,
  { timeoutMs = 90 * 60_000, everyMs = 15_000 } = {},
) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const run = await (await api.get(`/api/v1/onramp/apply-runs/${id}`)).json();
    if (DONE.test(run.status)) return run;
    if (FAILED.test(run.status)) throw new Error(`apply run ${id} ${run.status}: ${run.error}`);
    await new Promise((r) => setTimeout(r, everyMs));
  }
  throw new Error(`apply run ${id} timed out`);
}

export async function latestApplyRun(api: APIRequestContext) {
  const runs = (await (await api.get('/api/v1/onramp/apply-runs')).json()) as Array<Record<string, any>>;
  return runs.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))[0];
}

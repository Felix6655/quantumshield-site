import type { DetachedSigEnvelope, MempoolItem, SubmitResponse } from "./types";

const NODE_URL_KEY = "qs_node_url";
const DEFAULT_NODE_URL = "http://127.0.0.1:3008";

export async function getNodeUrl(): Promise<string> {
  const result = await chrome.storage.local.get(NODE_URL_KEY);
  return (result[NODE_URL_KEY] as string | undefined) ?? DEFAULT_NODE_URL;
}

export async function setNodeUrl(url: string): Promise<void> {
  await chrome.storage.local.set({ [NODE_URL_KEY]: url.replace(/\/+$/, "") });
}

export async function getHealth(): Promise<boolean> {
  try {
    const base = await getNodeUrl();
    const res = await fetch(`${base}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function getMempool(): Promise<MempoolItem[]> {
  const base = await getNodeUrl();
  const res = await fetch(`${base}/mempool`);
  if (!res.ok) throw new Error(`mempool fetch failed: ${res.status}`);
  return (await res.json()) as MempoolItem[];
}

export async function submitTransaction(envelope: DetachedSigEnvelope): Promise<SubmitResponse> {
  const base = await getNodeUrl();
  const res = await fetch(`${base}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(envelope),
  });
  return (await res.json()) as SubmitResponse;
}

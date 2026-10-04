import "server-only";
import { MongoClient, type Collection, type ObjectId } from "mongodb";
import type { WaitStatus } from "@/lib/waitlist";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "rubeeru_waitlist";

export type WaitlistDoc = {
  _id: ObjectId;
  name: string;
  email: string;
  x: string; // handle without @, or numeric X user id
  key: string; // "email:a@b.c"; unique, so the same person can't join twice
  use?: string; // USE_OPTIONS value
  ref?: string; // ?ref= the visitor arrived with
  status: WaitStatus;
  createdAt: Date;
  updatedAt?: Date;
  invitedAt?: Date;
};

// Survive dev hot reloads without opening a new connection each time.
const g = globalThis as unknown as { _waitlist?: Promise<Collection<WaitlistDoc>> };

export function waitlist() {
  g._waitlist ??= (async () => {
    const col = new MongoClient(uri).db(dbName).collection<WaitlistDoc>("waitlist");
    await col.createIndex({ key: 1 }, { unique: true });
    await col.createIndex({ x: 1 }, { unique: true, sparse: true });
    await col.createIndex({ status: 1, createdAt: -1 });
    await col.createIndex({ createdAt: -1 });
    return col;
  })().catch((e) => {
    g._waitlist = undefined; // let the next request retry instead of caching the failure
    throw e;
  });
  return g._waitlist;
}

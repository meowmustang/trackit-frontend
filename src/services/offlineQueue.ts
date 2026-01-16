import { openDB } from "idb"

const DB_NAME = "trackit-offline"
const STORE = "events"

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, {
        keyPath: "client_event_id",
      })
    }
  },
})

export async function queueEvent(event: any) {
  const db = await dbPromise
  await db.put(STORE, {
    ...event,
    status: "pending",      // pending | failed
    error: null,
    queued_at: Date.now(),
  })
}

export async function getQueuedEvents() {
  const db = await dbPromise
  const all = await db.getAll(STORE)

  return all
    .filter(e => e.status === "pending")
    .sort((a, b) => a.queued_at - b.queued_at)
}


export async function removeEvent(id: string) {
  const db = await dbPromise
  await db.delete(STORE, id)
}

export async function markEventFailed(
  id: string,
  error: any,
) {
  const db = await dbPromise
  const e = await db.get(STORE, id)
  if (!e) return

  e.status = "failed"
  e.error = error
  await db.put(STORE, e)
}


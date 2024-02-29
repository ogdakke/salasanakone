let request: IDBOpenDBRequest
let db: IDBDatabase
let version = 1

export interface User {
  id: string
  name: string
  email: string
}

export enum Stores {
  Languages = "languages",
}

const dbName = "salaDb" as const

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open(dbName)

    request.onupgradeneeded = () => {
      db = request.result

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Languages)) {
        console.log("Creating languages store")
        db.createObjectStore(Stores.Languages)
      }
      // no need to resolve here
    }

    request.onsuccess = () => {
      db = request.result
      version = db.version
      console.log("request.onsuccess - initDB", version)
      resolve(true)
    }

    request.onerror = () => {
      resolve(false)
    }
  })
}

export const setData = <T>(storeName: Stores, data: T, key: string): Promise<T | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName, version)

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data)
      db = request.result
      const tx = db.transaction(storeName, "readwrite")
      const store = tx.objectStore(storeName)
      store.add(data, key)
      resolve(key)
    }

    request.onerror = () => {
      const error = request.error?.message
      if (error) {
        resolve(error)
      } else {
        resolve("Unknown error")
      }
    }
  })
}

export function getDataForKey<T = string[]>(
  storeName: Stores,
  key: string,
): Promise<T | undefined> {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName)

    request.onsuccess = () => {
      console.log("request.onsuccess - getDataForKey")
      db = request.result
      const tx = db.transaction(storeName, "readonly")
      const store = tx.objectStore(storeName)
      const res = store.get(key) as IDBRequest<T | undefined>

      res.onsuccess = () => resolve(res.result)
    }
  })
}

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  return new Promise((resolve) => {
    request = indexedDB.open(dbName)

    request.onsuccess = () => {
      console.log("request.onsuccess - getAllData")
      db = request.result
      const tx = db.transaction(storeName, "readonly")
      const store = tx.objectStore(storeName)
      const res = store.getAll()
      res.onsuccess = () => {
        resolve(res.result)
      }
    }
  })
}


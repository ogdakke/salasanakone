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
    const request = indexedDB.open(dbName)

    request.onupgradeneeded = () => {
      const db = request.result

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Languages)) {
        db.createObjectStore(Stores.Languages)
      }
      // no need to resolve here
    }

    request.onsuccess = () => {
      const db = request.result
      version = db.version
      resolve(true)
    }

    request.onerror = () => {
      resolve(false)
    }
  })
}

export const setData = <T>(storeName: Stores, data: T, key: string): Promise<T | string | null> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName, version)

    request.onsuccess = () => {
      const db = request.result
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

export const deleteKey = (storeName: Stores, key: string): Promise<undefined | "failed"> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName, version)

    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(storeName, "readwrite")
      const store = tx.objectStore(storeName)
      const res = store.delete(key)
      res.onerror = () => resolve("failed")
      res.onsuccess = () => resolve(res.result)
    }
  })
}

export function getDataForKey<T = string[]>(
  storeName: Stores,
  key: string,
): Promise<T | undefined> {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName)
    request.onsuccess = (event) => {
      const db = request.result
      const tx = db.transaction(storeName, "readonly")
      const store = tx.objectStore(storeName)
      const res = store.get(key) as IDBRequest<T | undefined>

      res.onsuccess = () => resolve(res.result)
    }
  })
}

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName)

    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(storeName, "readonly")
      const store = tx.objectStore(storeName)
      const res = store.getAll()
      res.onsuccess = () => {
        resolve(res.result)
      }
    }
  })
}

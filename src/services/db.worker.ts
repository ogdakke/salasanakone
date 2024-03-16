import { type Stores, deleteKey, getDataForKey, initDB, setData } from "@/services/database/db"

/** TODO implement the worker for heavy stuff - mainly:
 *  - Loading the dataset **to and from** indexedDB
 */
export class DatasetService {
  constructor() {
    initDB()
  }

  set<T>(store: Stores, dataset: T, key: string) {
    return setData(store, dataset, key)
  }

  async get(store: Stores, key: string) {
    return await getDataForKey(store, key)
  }

  async delete(store: Stores, key: string) {
    return await deleteKey(store, key)
  }
}

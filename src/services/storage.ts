
/**
 * helper to simplify usage of storages
 * @example const local = new Storage(window.localStorage);
 */
export class Storage {

  isSupported = true;

  private store: typeof localStorage;

  constructor (store:typeof localStorage) {
    this.store = store;
    try {
      const property = 'null';
      const value = '_test_store_by_storage_service';
      // NOTE check availability of storage
      this.store.setItem(property, value);
      const extracted = this.store.getItem(property);
      this.store.removeItem(property);
      if (extracted !== value) { throw new Error('Invalid "storage" behavior'); }
    } catch (error) {
      this.isSupported = false;
    }
  }

  remove = (name:string) => this.isSupported && this.store.removeItem(name);

  set = (name:string, data:unknown) => {
    if (!this.isSupported) { return null; }
    this.remove(name);
    this.store.setItem(name, JSON.stringify(data));
  };

  get = (name:string) => {
    if (!this.isSupported) { return null; }
    const data = this.store.getItem(name);
    try { // NOTE data can be simple string
      return JSON.parse(data || '');
    } catch (e) {
      return data;
    }
  };

  update = (name:string, data = {}) => {
    if (!this.isSupported) { return null; }
    // NOTE working fine only with objects
    const prev = this.get(name) || {};
    this.set(name, Object.assign(prev, data));
  };

}

export const localAppStorage = new Storage(window.localStorage);

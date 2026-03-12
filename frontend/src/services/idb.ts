import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SessionLog, Round, RoundAction } from '../types';

interface BJJRecordDB extends DBSchema {
  sessions: {
    key: string;
    value: SessionLog;
  };
  rounds: {
    key: string;
    value: Round;
  };
  roundActions: {
    key: string;
    value: RoundAction;
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      operation: 'create' | 'update' | 'delete';
      entity: string;
      data: any;
      timestamp: number;
    };
  };
}

class IndexedDBService {
  private db: IDBPDatabase<BJJRecordDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<BJJRecordDB>('bjj-record', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('rounds')) {
          db.createObjectStore('rounds', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('roundActions')) {
          db.createObjectStore('roundActions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async saveSession(session: SessionLog): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('sessions', session);
  }

  async getSession(id: string): Promise<SessionLog | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('sessions', id);
  }

  async getSessions(): Promise<SessionLog[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('sessions');
  }

  async deleteSession(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('sessions', id);
  }

  async addToSyncQueue(operation: 'create' | 'update' | 'delete', entity: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.add('syncQueue', {
      id: `${entity}-${Date.now()}`,
      operation,
      entity,
      data,
      timestamp: Date.now(),
    });
  }

  async getSyncQueue(): Promise<any[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('syncQueue');
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) await this.init();
    const allKeys = await this.db!.getAllKeys('syncQueue');
    for (const key of allKeys) {
      await this.db!.delete('syncQueue', key);
    }
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.clear('sessions');
    await this.db!.clear('rounds');
    await this.db!.clear('roundActions');
    await this.db!.clear('syncQueue');
  }
}

export default new IndexedDBService();

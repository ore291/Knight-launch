import Dexie, { type Table } from 'dexie';
import {type Project } from './models/Project';
import {type Screenshot } from './models/Screenshot';








// Database class extending Dexie
class LaunchMaticDB extends Dexie {
  projects!: Table<Project>;
  screenshots!: Table<Screenshot>;

  constructor() {
    super('LaunchMaticDB');
    this.version(2).stores({
      projects: '++id, name, orientation, createdAt, updatedAt',
      screenshots: '++id, projectId, baseImage', // Updated to include baseImage index if needed
    });
    this.version(1).stores({
      projects: '++id, name,orientation, createdAt, updatedAt', // Schema for projects table
      screenshots: '++id, projectId', // Schema for screenshots table with projectId index
    });
  }
}

// Export the database instance
export const db = new LaunchMaticDB();
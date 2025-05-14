import { db } from "../db"; // Import the Dexie instance
import type { Project } from "../models/Project";

// Function to get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projects = await db.projects.toArray();
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error; // Re-throw to handle errors upstream if needed
  }
};
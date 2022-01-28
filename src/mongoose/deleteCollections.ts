import { Collection, connection } from "mongoose";


export async function deleteCollections(): Promise<boolean> {
    try {
        const db = connection.db;
        const collectionList = await db.listCollections().toArray();
        collectionList.forEach(async (colection) => {
          await db.dropCollection(colection.name);
        });
        return true;
        
    } catch (error) {
        return false
    }
  }
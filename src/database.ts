import * as mongodb from 'mongodb';
import { Employee } from './employee';

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {}

export async function connectToDataBase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackProject");
    await applySchemaValidation(db);

    const employeesConnection = db.collection<Employee>('employees');
    collections.employees = employeesConnection;
}

export async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            propierties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid' and 'senior'",
                    enum: ["junior", "mid", "senior"]
                }
            }
        }
    }

    await db.command({
        collMod: 'employees',
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if(error.codeName === 'NamespaceNotFund') {
            await db.createCollection('employees', {validator: jsonSchema})
        }
    })
}
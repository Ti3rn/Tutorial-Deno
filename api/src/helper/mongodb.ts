import { MongoClient } from "../../deps.ts";

class MongoDatabase {
  public client: MongoClient;
  private static instance: MongoDatabase;
  private MONGO_URL: string;
  private DB_NAME: string;

  constructor() {
    console.log("Connecting to mongo");
    this.MONGO_URL = Deno.env.get("MONGO_URL") || "mongodb://localhost:27017";
    this.DB_NAME = Deno.env.get("DB_NAME") || "todo";
    this.client = {} as MongoClient;
  }

  async connect() {
    const mongoClient = new MongoClient();
    await mongoClient.connect(this.MONGO_URL);
    this.client = mongoClient;
  }

  get getDatabase() {
    return this.client.database(this.DB_NAME);
  }

  static async getInstance(): Promise<MongoDatabase> {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    await MongoDatabase.instance.connect();
    // const mongoDB = new MongoDatabase();
    // await mongoDB.connect();
    return this.instance;
  }
}

export default MongoDatabase;

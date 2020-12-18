import MongoDatabase from "../helper/mongodb.ts";
import { validateTodo } from "../utils/validation.ts";
import { ITodo } from "../model/todoModel.ts";
import { Bson } from "../../deps.ts";

const db = await MongoDatabase.getInstance();

const tododDb = db.getDatabase.collection<ITodo>("todo");

// deno-lint-ignore no-explicit-any
export const getAll = async (context: any) => {
  console.log("Getting All todos");
  let res: Record<string, unknown>;
  try {
    const result = await tododDb.find().toArray();
    res = {
      success: true,
      length: result.length,
      data: result,
    };
  } catch (err) {
    res = {
      success: false,
      err: "Request fail",
    };
  }
  context.response.body = JSON.stringify(res);
};

// deno-lint-ignore no-explicit-any
export const get = async (context: any) => {
  const id: string = context.params.id;
  const msgErrorNotFound = "Not found";
  console.log(`Getting todo ${id}`);
  let res: Record<string, unknown>;
  try {
    const result = await tododDb.findOne({ _id: new Bson.ObjectId(id) });
    if (!result) {
      throw new Error(msgErrorNotFound);
    }
    res = {
      success: true,
      data: result,
    };
  } catch (err) {
    res = {
      success: false,
      error: err.toString(),
    };
    if (err.message === msgErrorNotFound) {
      context.response.status = 404;
    } else {
      context.response.status = 500;
    }
  }
  context.response.body = JSON.stringify(res);
};

// deno-lint-ignore no-explicit-any
export const post = async (context: any) => {
  console.log("Adding Todo...");

  const body = context.request.body();
  const data: ITodo = await body.value;
  let res: Record<string, unknown>;

  try {
    await validateTodo(data);
    const reqResponse = await tododDb.insertOne(data);
    res = {
      success: true,
      data: reqResponse,
    };
  } catch (err) {
    res = {
      success: false,
      err,
    };
  }

  context.response.body = JSON.stringify(res);
};

// deno-lint-ignore no-explicit-any
export const update = (context: any) => {};

// deno-lint-ignore no-explicit-any
export const remove = (context: any) => {};

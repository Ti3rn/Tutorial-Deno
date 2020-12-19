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
  console.log(`Getting todo ${id}`);
  let res: Record<string, unknown>;
  try {
    const result = await tododDb.findOne({ _id: new Bson.ObjectId(id) });
    if (!result) {
      throw new Error("Todo not found");
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
    if (err.message.includes("found")) {
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
export const update = async (context: any) => {
  const id: string = context.params.id;
  console.log(`Updating todo id ${id}`);
  let res: Record<string, unknown>;
  try {
    const body = context.request.body();
    const data = await body.value;
    if (!data) {
      throw new Error("Empty body!");
    }

    const response = await tododDb.updateOne(
      { _id: new Bson.ObjectId(id) },
      { $set: data }
    );

    res = {
      success: true,
      data: response,
    };
  } catch (err) {
    res = {
      success: false,
      error: err.toString(),
    };

    context.response.status = 500;
  }

  context.response.body = JSON.stringify(res);
};

// deno-lint-ignore no-explicit-any
export const remove = async (context: any) => {
  const id: string = context.params.id;
  console.log(`Removing todo ${id}`);
  let res: Record<string, unknown>;
  try {
    const result = await tododDb.deleteOne({ _id: new Bson.ObjectId(id) });
    if (!result) {
      throw new Error("Todo not found to delete");
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
    if (err.message.includes("found")) {
      context.response.status = 404;
    } else {
      context.response.status = 500;
    }
  }
  context.response.body = JSON.stringify(res);
};

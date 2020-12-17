import MongoDatabase from "../helper/mongodb.ts";
import { validateTodo } from "../utils/validation.ts";
import { ITodo } from "../model/todoModel.ts";

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
      err,
    };
  }
  context.response.body = JSON.stringify(res);
};

// deno-lint-ignore no-explicit-any
export const get = (context: any) => {
  console.log("Getting a todo");
  try {
    const todo = {
      title: "My Todo",
      description: "Todo description",
      createdAt: new Date(),
    };
    const response = {
      success: true,
      todo,
    };
    context.response.body = JSON.stringify(response);
  } catch (error) {
    const response = {
      success: false,
      error,
    };
    context.response.status = 500;
    context.response.body = JSON.stringify(response);
  }
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

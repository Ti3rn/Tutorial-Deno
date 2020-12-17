import { firstMessages, validate } from "../../deps.ts";
import { todoSchema, ITodo } from "../model/todoModel.ts";

export const validateTodo = async (todo: ITodo) => {
  const [passes, errors] = await validate(todo, todoSchema);
  if (!passes) {
    throw firstMessages(errors);
  }

  return true;
};

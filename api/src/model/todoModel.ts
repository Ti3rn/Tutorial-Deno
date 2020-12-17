import {
  lengthBetween,
  isString,
  required,
  nullable,
  isBool,
  isDate,
} from "../../deps.ts";

export interface ITodo {
  name: string;
  title: string;
  description?: string;
  done: boolean;
  color?: string;
  end_at?: Date;
  created_at: Date;
  updated_at?: Date;
}

export const todoSchema = {
  name: [lengthBetween(5, 50), isString, required],
  title: [lengthBetween(10, 100), isString, required],
  description: [isString, nullable],
  done: [isBool, required],
  color: [isString, nullable],
  endAt: [isDate, nullable],
  createdAt: [isDate, required],
  updatedAt: [isDate, nullable],
};

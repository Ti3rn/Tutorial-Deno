import todoRouter from "./todoRouter.ts";

// deno-lint-ignore no-explicit-any
const initRouters = (app: any) => {
  app.use(todoRouter.routes());
};

export default initRouters;

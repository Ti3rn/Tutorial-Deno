import { Router } from "../../deps.ts";
import {
  get,
  post,
  getAll,
  update,
  remove,
} from "../controller/todoController.ts";
const router = new Router();

router
  .get("/:id", get)
  .get("/", getAll)
  .post("/", post)
  .put("/:id", update)
  .delete("/:id", remove);

export default router;

import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  entities: [Post],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: "reddit_clone",
  debug: !__prod__,
  type: "postgresql",
  user: "postgres",
  password: "postgres",
} as Parameters<typeof MikroORM.init>[0];

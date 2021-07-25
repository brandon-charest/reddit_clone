import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, { title: "my first post" });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  //   console.log(posts);
  const app = express();

  // TODO: move to env file
  const allowedOrigins = [
    "http://localhost:4000",
    "https://studio.apollographql.com",
  ];
  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };
  app.use(cors(options));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on port 4000");
  });
};

main();

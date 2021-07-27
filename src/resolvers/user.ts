import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UseNamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UseNamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashPass = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashPass,
    });
    await em.persistAndFlush(user);
    return user;
  }
}

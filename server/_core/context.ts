import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch {
    // If not authenticated (or OAuth is not configured in preview), provide default preview admin user
    try {
      const existingUser = await db.getUserByOpenId("preview-user");
      if (existingUser) {
        user = existingUser;
      } else {
        await db.upsertUser({
          openId: "preview-user",
          name: "建築士 (Preview User)",
          email: "user@example.com",
          loginMethod: "local",
          role: "admin",
        });
        user = (await db.getUserByOpenId("preview-user")) ?? null;
      }
    } catch {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

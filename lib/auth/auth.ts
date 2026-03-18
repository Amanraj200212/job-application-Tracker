// this all info caame from better auth website

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initialUserBoard } from "../init-user-board";

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
  
  // to coonect databse we need mongodbapdater and two values are first is database instance and other is client 
  database: mongodbAdapter(db, {
    client,
  }),
  
  // make cache of session
  databaseHooks: {
    cookieCache:{
      enabled:true,
      maxAge: 60 * 60,
    },
  },

  emailAndPassword: {
    enabled:true,
  },

  socialProviders: {
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // use for database by betterauth to create
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if(user.id) {
            await initialUserBoard(user.id);
          }
        }
      }
    }
  }
});

export async function getSession() {
  const result = await auth.api.getSession ( {
    headers: await headers(),
  });

  return result;
}


export async function signOut() {
  const result = await auth.api.signOut ( {
    headers: await headers(),
  });

  if(result.success) {
    redirect("/sign-in"); // IN server side routing we use redirt but in client we use userouter
  }
}
// this all info caame from better auth website

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db();

export const auth = betterAuth({
  // to coonect databse we need mongodbapdater and two values are first is database instance and other is client 
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled:true,
  },

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
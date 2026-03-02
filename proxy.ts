// before version 16 it known as middleware

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy ( request: NextRequest) {
  const session = await getSession();

  const isSignInPage = request.nextUrl.pathname.startsWith('/sign-in');
  const isSignUpPage = request.nextUrl.pathname.startsWith('/sign-up');

  // if user is already sign-in then dont should open /sign-in or /sign-up  page
  if((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next();
}


"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label} from "@/components/ui/label"
import { signIn } from "@/lib/auth/auth-client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if(result.error) {
        setError(result.error.message ?? "Failed to sign in")
      } else {
        router.push("/dashboard");
      }

    } catch (err) {
      setError("An unexpected Error occured in Sign Up");
      console.log(err);
    } finally {
      setLoading(false);
    }
  } 

  return (
    <div className="flex miin-h-[calc(100vh-4rem) items-center justify-center bg-white p-4]">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-600">
            Login an account to start tracking your job applications
          </CardDescription>
        </CardHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
          )}

            <div className="space-y-2">
              <Label htmlFor="email"  className="text-gray-700">Email</Label>
              <Input 
                id="email"
                type="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@examplel.com" 
                required  
                className="border-gray-700 focus:ring-primary"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password"  className="text-gray-700">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="*********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={8} 
                className="border-gray-700 focus:ring-primary" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading} // for anyone can't spam button while login
            >
             {loading ? "Login your account..." : "Sign In"}
            </Button>
            <p>
              Don't have an account ? {" "}
              <Link href="/sign-up" className="font-medium text-primary hover:underline" >Sign Up</Link>
            </p>
          </CardFooter>
        </form>
        
      </Card>
    </div>
  )
}

export default SignIn
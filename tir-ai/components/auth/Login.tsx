'use client'
import { login, signInWithGithub } from '@/actions/auth'
import { FormEvent, useState } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
 
export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
 
    const formData = new FormData(event.currentTarget)
    
    const result = await login(formData);

    console.log(result.status)

    if (result.status === 'success') {
      redirect('/dashboard')
    } else {
      setError(result.status)
      console.log(error)
    }

    setLoading(false)

 
  }
 
  return (
    <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md p-5"
      >
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">
          Welcome to my site!
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          className="w-full p-3 mb-4 bg-[#2a2f3b] border border-[#3a3f4b] rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="w-full relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 mb-4 bg-[#2a2f3b] border border-[#3a3f4b] rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Link
            href="/forgot-password"
            className="absolute right-3 top-3 text-primary text-sm hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      
        <button
          type="submit"
          className="w-full p-3 bg-primary text-white rounded-lg hover:br-primary transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-gray-400 text-sm mt-4">
          Not a member?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>

        <p className="text-gray-400 text-sm mt-4">
          Reset Password{' '}
          <Link href="/reset-password" className="text-primary hover:underline">
            Reset Password
          </Link>
        </p>
      </form>

      <button
          onClick={() => signInWithGithub()}
          className="w-1/4 px-3 py-3 bg-white text-blue rounded-lg hover:br-primary transition-colors"
        >
          Sign in with Github
      </button>
    </div>
  )
}


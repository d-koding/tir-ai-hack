"use client";
import { useState, FormEvent } from "react";
import { signup } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result.status === 'success') {
      router.push('/login')
    } else {
      setError(result.status ?? 'an error occurred')
    }

    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md p-5"
      >
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">
        Register
        </h2>

        <div className="w-full">
          <label htmlFor="username" className="text-white mb-1 block">
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            className="w-full p-3 mb-4 bg-[#2a2f3b] border border-[#3a3f4b] rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="w-full">
          <label htmlFor="email" className="text-white mb-1 block">
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            required
            className="w-full p-3 mb-4 bg-[#2a2f3b] border border-[#3a3f4b] rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-white mb-1 block">
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 mb-4 bg-[#2a2f3b] border border-[#3a3f4b] rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          aria-busy={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
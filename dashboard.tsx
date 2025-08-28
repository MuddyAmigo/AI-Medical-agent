"use client";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                <h1 className="ml-3 text-xl font-bold">AI Medical Assistant</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName}!</span>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600">Your AI Medical Assistant dashboard will be here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
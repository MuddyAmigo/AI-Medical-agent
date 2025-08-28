"use client";
import FeatureBentoGrid from "./_components/FeatureBentoGrid";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  // Use the useUser hook to get the current user's state
  const { user } = useUser();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"🩺 Revolutionize patient care with AI voice Agents"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Deliver instant, accurate medical assistance with AI-powered voice.
          Automate appointments, scheduling, symptom triage and follow-up care - 24/7.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Conditionally set the href based on user's existence */}
          <Link href={user ? "/dashboard" : "/sign-in"}>
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get Started
            </button>
          </Link>
          <button className="w-60 transform rounded-lg bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl bg-neutral-100 p-4 shadow-md dark:bg-neutral-900"
        >
          
        </motion.div>
      </div>
      <FeatureBentoGrid />
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">AI Medical Assistant</h1>
      </div>
      {!user ? (
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button className="w-24 transform rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 md:w-32">
              Dashboard
            </button>
          </Link>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      )}
    </nav>
  );
};
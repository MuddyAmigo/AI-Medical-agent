"use client";
import { cn } from "@/lib/utils";
import React from "react";
import {
  IconStethoscope,
  IconHeartbeat,
  IconBrain,
  IconMicrophone,
  IconClipboardCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

export default function FeatureBentoGrid() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const VoiceInteraction = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-blue-200 dark:border-blue-800 p-2 items-center space-x-2 bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shrink-0" />
        <div className="w-full bg-blue-100 h-4 rounded-full dark:bg-blue-800" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-green-200 dark:border-green-800 p-2 items-center space-x-2 w-3/4 ml-auto bg-green-50 dark:bg-green-900/20"
      >
        <div className="w-full bg-green-100 h-4 rounded-full dark:bg-green-800" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-blue-200 dark:border-blue-800 p-2 items-center space-x-2 bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shrink-0" />
        <div className="w-full bg-blue-100 h-4 rounded-full dark:bg-blue-800" />
      </motion.div>
    </motion.div>
  );
};

const SymptomAnalysis = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const symptoms = ["Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness"];
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 p-2"
    >
      {symptoms.map((symptom, i) => (
        <motion.div
          key={"symptom-" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 60) + 60 + "%",
          }}
          className="flex flex-row rounded-full border border-red-200 dark:border-red-800 p-2 items-center space-x-2 bg-red-50 dark:bg-red-900/20 w-full h-4"
        >
          <span className="text-xs text-red-600 font-medium">{symptom}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const AIProcessing = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #3b82f6, #06b6d4, #10b981, #8b5cf6)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg flex items-center justify-center">
        <div className="text-white font-semibold">AI Processing...</div>
      </motion.div>
    </motion.div>
  );
};

const MedicalRecords = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          <IconHeartbeat className="h-6 w-6 text-red-500" />
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Blood Pressure: High
        </p>
        <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Alert
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <IconStethoscope className="h-6 w-6 text-green-500" />
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Heart Rate: Normal
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Healthy
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <IconBrain className="h-6 w-6 text-blue-500" />
        </div>
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Stress Level: Moderate
        </p>
        <p className="border border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Monitor
        </p>
      </motion.div>
    </motion.div>
  );
};

const Consultation = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-blue-200 dark:border-blue-800 p-2 items-start space-x-2 bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <IconStethoscope className="h-4 w-4 text-white" />
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Based on your symptoms, I recommend scheduling a check-up with your primary care physician...
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-green-200 dark:border-green-800 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-green-50 dark:bg-green-900/20"
      >
        <p className="text-xs text-green-700 dark:text-green-300">Thank you for the guidance!</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shrink-0" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Voice Interaction",
    description: (
      <span className="text-sm">
        Speak naturally with your AI medical assistant for seamless health consultations.
      </span>
    ),
    header: <VoiceInteraction />,
    className: "md:col-span-1",
    icon: <IconMicrophone className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Symptom Analysis",
    description: (
      <span className="text-sm">
        Advanced AI analyzes your symptoms to provide preliminary health insights.
      </span>
    ),
    header: <SymptomAnalysis />,
    className: "md:col-span-1",
    icon: <IconClipboardCheck className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "AI Processing",
    description: (
      <span className="text-sm">
        Real-time AI processing ensures accurate and quick medical recommendations.
      </span>
    ),
    header: <AIProcessing />,
    className: "md:col-span-1",
    icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Health Monitoring",
    description: (
      <span className="text-sm">
        Track vital signs and health metrics with intelligent monitoring and alerts.
      </span>
    ),
    header: <MedicalRecords />,
    className: "md:col-span-2",
    icon: <IconHeartbeat className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Smart Consultation",
    description: (
      <span className="text-sm">
        Get personalized medical advice and recommendations from your AI assistant.
      </span>
    ),
    header: <Consultation />,
    className: "md:col-span-1",
    icon: <IconStethoscope className="h-4 w-4 text-neutral-500" />,
  },
];
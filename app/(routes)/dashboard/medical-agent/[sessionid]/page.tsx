"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Circle, Phone, PhoneOff, Loader2 } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { doctorAgent } from "../../_component/DoctorAgentCard";
import { toast } from "sonner";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent | null;
  createdOn: string;
  voiceId: string;
};

type TranscriptMessage = {
  role: "user" | "assistant";
  transcript: string;
};

export default function MedicalVoiceAgent() {
  const { sessionid } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false); // New state for report generation
  const router = useRouter();

  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "active" | "stopping"
  >("idle");
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [callDuration, setCallDuration] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------- Fetch Session ----------
  useEffect(() => {
    if (sessionid) {
      const getSessionDetails = async () => {
        try {
          const result = await axios.get(
            `/api/session-chat?sessionId=${sessionid}`
          );
          setSessionDetail(result.data.data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch session details.");
        } finally {
          setLoading(false);
        }
      };
      getSessionDetails();
    }
  }, [sessionid]);

  // ---------- Timer ----------
  useEffect(() => {
    if (callStatus === "active") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  // ---------- Handlers ----------
  const handleCallStart = useCallback(() => {
    setCallStatus("active");
  }, []);

  const handleCallEnd = useCallback(() => {
    endCall(true);
  }, []);

  const handleMessage = useCallback((message: any) => {
    if (message.type === "transcript" && message.transcript) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === message.role) {
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            transcript: message.transcript,
          };
        } else {
          newMessages.push({
            role: message.role,
            transcript: message.transcript,
          });
        }
        localStorage.setItem("callMessages", JSON.stringify(newMessages));
        return newMessages;
      });
    }
  }, []);

  // ---------- Start Call ----------
  const startCall = () => {
    setCallStatus("connecting");
    setMessages([]);
    setCallDuration(0);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiInstance(vapi);

    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
  };

  // ---------- End Call ----------
  const endCall = async (fromEvent = false) => {
    if (!vapiInstance) return;

    if (!fromEvent) {
      setCallStatus("stopping");
      await vapiInstance.stop();
    }

    // ✅ Remove with proper handler refs
    vapiInstance.off("call-start", handleCallStart);
    vapiInstance.off("call-end", handleCallEnd);
    vapiInstance.off("message", handleMessage);

    setVapiInstance(null);
    setCallStatus("idle");

    // Start generating report
    setGeneratingReport(true);
    
    try {
      await GenerateReport();
      toast.success("Report generated successfully");
      
      // Clear localStorage after successful report generation
      localStorage.removeItem('callMessages');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate report. Please try again.");
      setGeneratingReport(false);
    }
  };

  // ---------- Report ----------
  const GenerateReport = async () => {
    const result = await axios.post("/api/generate-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionid: sessionid,
    });
    console.log("Report generated:", result.data);
    return result.data;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const lastUserMessage = messages.findLast((msg) => msg.role === "user");
  const lastAssistantMessage = messages.findLast(
    (msg) => msg.role === "assistant"
  );

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-center p-4">
        <div className="text-red-600 bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">An Error Occurred</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show report generation loader
  if (generatingReport) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Generating Medical Report</h2>
            <p className="text-gray-600 text-center max-w-md mb-4">
              Please wait while we analyze your consultation and generate a detailed medical report...
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Processing conversation transcript
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Circle
              className={`w-4 h-4 transition-colors duration-300 ${
                callStatus === "active"
                  ? "fill-green-500 text-green-500"
                  : "fill-gray-400 text-gray-400"
              }`}
            />
            <span
              className={`font-medium text-sm transition-colors duration-300 ${
                callStatus === "active" ? "text-green-600" : "text-gray-500"
              }`}
            >
              {callStatus === "idle" && "Not Connected"}
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "active" && "Live"}
              {callStatus === "stopping" && "Ending Call..."}
            </span>
          </div>
          <div className="text-gray-500 font-semibold text-lg tracking-wider bg-gray-100 px-3 py-1 rounded-md">
            {formatDuration(callDuration)}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-6 sm:p-8 overflow-y-auto flex flex-col">
          {/* Doctor Profile */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
              {sessionDetail?.selectedDoctor?.image ? (
                <img
                  src={sessionDetail.selectedDoctor.image}
                  alt={sessionDetail.selectedDoctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {sessionDetail?.selectedDoctor?.name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {sessionDetail?.selectedDoctor?.name || "General Physician"}
            </h1>
            <p className="text-gray-500 text-md mt-1">AI Medical Voice Agent</p>
          </div>

          {/* Live Messages */}
          <div className="flex-grow flex flex-col justify-end pt-8">
            {callStatus === "idle" && (
              <p className="text-gray-400 text-center max-w-md mx-auto">
                Click the 'Start Call' button below to begin your consultation
                with the AI agent.
              </p>
            )}
            {callStatus !== "idle" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    AI Assistant says:
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg min-h-[60px] text-gray-800 text-md">
                    <p>{lastAssistantMessage?.transcript || "..."}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">
                    You said:
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg min-h-[60px] text-blue-900 text-md">
                    <p>{lastUserMessage?.transcript || "..."}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center p-4 bg-white border-t border-gray-200">
          {callStatus === "idle" || callStatus === "stopping" ? (
            <button
              onClick={startCall}
              disabled={callStatus === "stopping"}
              className="flex items-center gap-3 px-8 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform transform active:scale-95 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Phone className="w-6 h-6" />
              Start Call
            </button>
          ) : (
            <button
              onClick={() => endCall()}
              className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-transform transform active:scale-95 text-lg font-semibold animate-pulse"
            >
              <PhoneOff className="w-6 h-6" />
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
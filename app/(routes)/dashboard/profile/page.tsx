"use client";

import React, { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  Activity,
  Shield,
  Clock,
  Zap,
  Home,
  ArrowLeft
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const context = useContext(UserDetailContext);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    thisMonth: 0,
    lastSession: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionStats = async () => {
      try {
        const result = await axios.get('/api/session-chat?sessionId=all');
        if (result.data?.success) {
          const sessions = result.data.data;
          
          // Calculate stats
          const total = sessions.length;
          const now = new Date();
          const thisMonth = sessions.filter((s: any) => {
            const sessionDate = new Date(s.createdOn);
            return sessionDate.getMonth() === now.getMonth() && 
                   sessionDate.getFullYear() === now.getFullYear();
          }).length;
          
          const lastSession = sessions.length > 0 ? sessions[0].createdOn : null;
          
          setSessionStats({ total, thisMonth, lastSession });
        }
      } catch (error) {
        console.error('Error fetching session stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSessionStats();
    }
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userDetail = context?.userDetail;
  const userInitials = user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U";
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }) : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account and view your activity</p>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="border-2 border-blue-100 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-blue-500 ring-offset-4">
                <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center sm:text-left flex-1">
                <CardTitle className="text-3xl mb-2">
                  {user?.firstName} {user?.lastName}
                </CardTitle>
                <CardDescription className="text-base flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Active Account
                  </Badge>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="text-gray-600">Member since {memberSince}</span>
                </CardDescription>
              </div>
              
              <div className="flex flex-col items-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg">
                <CreditCard className="w-8 h-8 mb-2" />
                <div className="text-3xl font-bold">{userDetail?.credits || 0}</div>
                <div className="text-sm opacity-90">Credits</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Information Card */}
          <Card className="shadow-lg border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Full Name</div>
                    <div className="font-medium text-gray-900">
                      {user?.firstName} {user?.lastName || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Email Address</div>
                    <div className="font-medium text-gray-900 break-all">
                      {user?.primaryEmailAddress?.emailAddress || 'No email'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Account Created</div>
                    <div className="font-medium text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">User ID</div>
                    <div className="font-mono text-xs text-gray-700 bg-white px-2 py-1 rounded border">
                      {user?.id}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Stats Card */}
          <Card className="shadow-lg border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Activity & Statistics
              </CardTitle>
              <CardDescription>Your consultation history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <div className="text-sm text-blue-700">Total Sessions</div>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{sessionStats.total}</div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <div className="text-sm text-green-700">This Month</div>
                  </div>
                  <div className="text-3xl font-bold text-green-900">{sessionStats.thisMonth}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Last Consultation</div>
                    <div className="font-medium text-gray-900">
                      {sessionStats.lastSession 
                        ? new Date(sessionStats.lastSession).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'No consultations yet'
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <CreditCard className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Available Credits</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {userDetail?.credits || 0}
                      </div>
                      <Badge 
                        variant={userDetail?.credits && userDetail.credits > 5 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {userDetail?.credits && userDetail.credits > 5 ? "Good" : "Low"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Account Status Card */}
        <Card className="shadow-lg border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Overview of your account health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Account Status</div>
                  <div className="font-semibold text-green-600">Active</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email Status</div>
                  <div className="font-semibold text-blue-600">
                    {user?.primaryEmailAddress?.verification?.status === 'verified' ? 'Verified' : 'Pending'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Plan Type</div>
                  <div className="font-semibold text-purple-600">Free Plan</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

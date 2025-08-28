"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { StarIcon } from 'lucide-react'; // Added for visual parity

// Type definition for a doctor agent
export type doctorAgent = {
  id: number,
  name: string,
  specialty: string,
  description: string,
  image: string,
  voiceId: string,
  agentPrompt: string,
  gender: string
}

type props = {
  doctorAgent: doctorAgent
}

function DoctorAgentCard({ doctorAgent }: props) {
    const router = useRouter();
    const [note, setNote] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleStartConsultation = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/session-chat', {
                notes: note,
                selectedDoctor: doctorAgent
            });
            
            if (result.data?.success && result.data?.sessionId) {
                router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
            } else {
                console.error('Failed to create session:', result.data);
            }
        } catch (error) {
            console.error('Error starting consultation:', error);
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
            setNote('');
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {/* This is the visible card */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col p-4 border border-gray-100 h-[400px] cursor-pointer group">
                    <div className="w-full h-[200px] mb-3 overflow-hidden rounded-lg">
                        <Image
                            src={doctorAgent.image}
                            alt={`Dr. ${doctorAgent.name}`}
                            width={300}
                            height={200}
                            className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">Dr. {doctorAgent.name}</h3>
                            <p className="text-sm text-indigo-600 font-medium mb-2 line-clamp-1">{doctorAgent.specialty}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{doctorAgent.description}</p>
                        </div>
                        <Button className="mt-3 w-full bg-black text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Consult Now <ArrowRightIcon className="inline-block ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogTrigger>

            {/* This is the modal that opens on click - now styled like AddNewSessionDialog */}
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">Start New Consultation</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        You are starting a session with Dr. {doctorAgent.name}. Please describe your symptoms below.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                    {/* Doctor Summary Card - inspired by AddNewSessionDialog */}
                    <div className="bg-white border border-blue-200 rounded-lg p-4 flex items-center">
                        <div className="flex-shrink-0 mr-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400">
                                <Image 
                                    src={doctorAgent.image} 
                                    alt={doctorAgent.name} 
                                    width={64} 
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                Dr. {doctorAgent.name}
                            </h4>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {doctorAgent.specialty}
                                </span>
                                <div className="flex items-center text-yellow-400">
                                    <StarIcon className="w-4 h-4 fill-current" />
                                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {doctorAgent.description}
                            </p>
                        </div>
                    </div>

                    {/* Symptom Input Area */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Describe your symptoms or health concerns
                        </label>
                        <Textarea
                            placeholder="e.g., I have a persistent cough and a slight fever..."
                            className='h-[150px] resize-none'
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
                
                <DialogFooter className="pt-4 mt-auto border-t">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleStartConsultation}
                        disabled={loading || !note.trim()}
                        className="min-w-[140px] bg-green-600 hover:bg-green-700"
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="animate-spin mr-2 h-4 w-4" />
                                Starting...
                            </>
                        ) : (
                            <>
                                Start Consultation
                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DoctorAgentCard;
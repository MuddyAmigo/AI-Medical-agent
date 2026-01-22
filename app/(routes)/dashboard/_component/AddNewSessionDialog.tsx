"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2, StarIcon } from "lucide-react"
import { useState } from 'react'
import { doctorAgent }  from './DoctorAgentCard'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AddNewSessionDialog() {
    const router = useRouter();
    const [note,setNote]=useState<string>();
    const [loading,setLoading]=useState<boolean>(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(null);
    
    const OnClickNext = async ()=>{
        setLoading(true);
        try {
            const result = await axios.post('/api/suggest-doctors', {
                notes: note
            });
            console.log('API Response:', result.data);
            
            let doctorsArray: doctorAgent[] = [];
            
            if (Array.isArray(result.data)) {
                doctorsArray = result.data;
            } else if (result.data.doctors && Array.isArray(result.data.doctors)) {
                doctorsArray = result.data.doctors;
            } else if (result.data.suggestedDoctors && Array.isArray(result.data.suggestedDoctors)) {
                doctorsArray = result.data.suggestedDoctors;
            } else if (result.data.recommended_doctors && Array.isArray(result.data.recommended_doctors)) {
                doctorsArray = result.data.recommended_doctors;
            } else {
                console.error('Unexpected API response format:', result.data);
                setSuggestedDoctors([]);
                return;
            }
            
            const mappedDoctors = doctorsArray.map((doctor: any, index: number) => ({
                id: doctor.id || index + 1,
                name: doctor.name || doctor.specialist || 'Unknown Doctor',
                specialty: doctor.specialty || doctor.specialist || 'General Medicine',
                description: doctor.description || 'Experienced medical professional',
                image: doctor.image || '/default-doctor.jpg',
                voiceId: doctor.voiceId || '', // Provide a default or map from API
                agentPrompt: doctor.agentPrompt || '', // Provide a default or map from API
                gender: doctor.gender || 'male' // Default to male instead of unknown
            }));
            
            setSuggestedDoctors(mappedDoctors);
        } catch (error) {
            console.error('Error fetching suggested doctors:', error);
            setSuggestedDoctors([]);
        }
        setLoading(false);
    }

    const handleDoctorSelect = (doctor: doctorAgent) => {
        setSelectedDoctor(doctor);
    }

    const handleStartConsultation = async() => {
        if (!selectedDoctor) {
            console.error('No doctor selected');
            return;
        }

        setLoading(true);
        try {
            const result = await axios.post('/api/session-chat', {
                notes: note,
                selectedDoctor: selectedDoctor
            });
            
            console.log('Session created:', result.data);
            
            if (result.data?.success && result.data?.sessionId) {
                console.log('Session ID:', result.data.sessionId);
                router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
                
                
            } else {
                console.error('Failed to create session:', result.data);
            }
        } catch (error) {
            console.error('Error starting consultation:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setSuggestedDoctors([]);
        setSelectedDoctor(null);
        setNote('');
        setLoading(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mt-3'>
                    + Start a Consultation
                </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">Start New Consultation</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        {suggestedDoctors.length === 0 
                            ? "Describe your symptoms to get personalized doctor recommendations" 
                            : "Select a specialist for your consultation"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    {suggestedDoctors.length === 0 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Describe your symptoms or health concerns
                                </label>
                                <Textarea
                                    placeholder="Please describe your symptoms, when they started, and any relevant details..."
                                    className='h-[200px] resize-none'
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">Recommended Specialists</h3>
                                {selectedDoctor && (
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Dr. {selectedDoctor.name} selected
                                    </div>
                                )}
                            </div>
                            
                            {/* Professional doctor list */}
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="max-h-[400px] overflow-y-auto">
                                    {suggestedDoctors.map((doctor, index) => (
                                        <div 
                                            key={index}
                                            className={`flex items-center p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-200 ${
                                                selectedDoctor?.id === doctor.id 
                                                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleDoctorSelect(doctor)}
                                        >
                                            {/* Doctor Image */}
                                            <div className="flex-shrink-0 mr-4">
                                                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                                                    selectedDoctor?.id === doctor.id ? 'border-blue-400' : 'border-gray-200'
                                                }`}>
                                                    <Image 
                                                        src={doctor.image} 
                                                        alt={doctor.name} 
                                                        width={64} 
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            {/* Doctor Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                            Dr. {doctor.name}
                                                        </h4>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {doctor.specialty}
                                                            </span>
                                                            <div className="flex items-center text-yellow-400">
                                                                <StarIcon className="w-4 h-4 fill-current" />
                                                                <span className="text-sm text-gray-600 ml-1">4.8</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                            {doctor.description}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                                            Available for consultation
                                                        </div>
                                                    </div>

                                                    {/* Select Button */}
                                                    <div className="ml-4">
                                                        {selectedDoctor?.id === doctor.id ? (
                                                            <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Selected
                                                            </div>
                                                        ) : (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                className="hover:bg-blue-50 hover:border-blue-300"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDoctorSelect(doctor);
                                                                }}
                                                            >
                                                                Select
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Footer with count */}
                                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>{suggestedDoctors.length} specialist{suggestedDoctors.length !== 1 ? 's' : ''} found</span>
                                        <span className="text-xs">Click to select a doctor</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced symptom summary */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-blue-900 mb-1">Based on your symptoms</h5>
                                        <p className="text-sm text-blue-700">
                                            "{note?.slice(0, 150)}{note && note.length > 150 ? '...' : ''}"
                                        </p>
                                        <p className="text-xs text-blue-600 mt-2">
                                            We've recommended specialists who can best address your concerns.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4 border-t">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </DialogClose>
                    
                    {suggestedDoctors.length === 0 ? (
                        <Button 
                            disabled={!note?.trim() || loading} 
                            onClick={OnClickNext} 
                            className="min-w-[120px]"
                        >
                            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            {loading ? 'Finding...' : 'Find Doctors'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    ) : (
                        <Button 
                            disabled={!selectedDoctor || loading}
                            onClick={handleStartConsultation}
                            className="min-w-[140px] bg-green-600 hover:bg-green-700"
                        >
                            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                            {loading ? 'Starting...' : 'Start Consultation'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { AddNewSessionDialog }
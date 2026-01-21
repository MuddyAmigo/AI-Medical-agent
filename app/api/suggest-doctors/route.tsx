import { NextRequest, NextResponse } from 'next/server';
import { AIDoctorAgents } from '@/shared/list';
import { groqClient } from '@/config/OpenAiModel';

export async function POST(req: NextRequest) {
    const { notes } = await req.json();
    
    // Validate input
    if (!notes || notes.trim().length === 0) {
        return NextResponse.json({ error: "Notes are required" }, { status: 400 });
    }
    
    try {
        console.log('Received notes:', notes);
        console.log('Available doctors:', AIDoctorAgents.length);
        
        let completion;
        try {
            // Use Groq API (free tier with good limits)
            completion = await groqClient.chat.completions.create({
                model: "llama-3.1-8b-instant", // Updated free model on Groq
                messages: [
                    {
                        role: 'system',
                        content: `You are a medical AI assistant. Here is the list of available doctors: ${JSON.stringify(AIDoctorAgents)}. 
                        Based on user symptoms, suggest the most relevant doctors from this list. 
                        Return ONLY a JSON object with this exact structure:
                        {
                          "doctors": [
                            {
                              "id": number,
                              "name": "string",
                              "specialty": "string", 
                              "description": "string",
                              "image": "string"
                            }
                          ]
                        }
                        Do not include any markdown formatting or code blocks.`
                    },
                    { 
                        role: "user", 
                        content: `User symptoms: ${notes}. Please suggest 2-4 most relevant doctors from the available list. Return only JSON format without any markdown.` 
                    }
                ]
            });
        } catch (apiError: any) {
            console.error('Groq API Error:', {
                status: apiError?.status,
                message: apiError?.message,
                code: apiError?.code
            });
            
            // If Groq fails, throw error for fallback logic
            if (apiError?.status === 402) {
                throw new Error('Groq API payment required. Using smart local matching instead.');
            } else if (apiError?.status === 401) {
                throw new Error('Invalid Groq API key. Please check your API key.');
            } else if (apiError?.status === 429) {
                throw new Error('Groq API rate limit exceeded. Please try again later.');
            } else {
                throw new Error(`Groq API Error: ${apiError?.message || 'Unknown error'}`);
            }
        }
        
        const rawResponse = completion.choices[0]?.message?.content;
        console.log('Raw OpenAI response:', rawResponse);
        
        if (!rawResponse) {
            throw new Error('No response from OpenAI');
        }
        
        // Clean the response more thoroughly
        let cleanedResponse = rawResponse.trim();
        
        // Remove code blocks and markdown
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        cleanedResponse = cleanedResponse.replace(/^\s*json\s*/g, '');
        
        // Find JSON object bounds
        const startIndex = cleanedResponse.indexOf('{');
        const endIndex = cleanedResponse.lastIndexOf('}');
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('No valid JSON found in response');
        }
        
        const jsonString = cleanedResponse.substring(startIndex, endIndex + 1);
        console.log('Cleaned JSON string:', jsonString);
        
        let JSONResp;
        try {
            JSONResp = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Attempted to parse:', jsonString);
            
            // Fallback: return some default doctors if parsing fails
            const fallbackDoctors = AIDoctorAgents.slice(0, 3).map(doctor => ({
                id: doctor.id,
                name: doctor.specialist,
                specialty: doctor.specialist,
                description: doctor.description,
                image: doctor.image
            }));
            
            return NextResponse.json({ 
                doctors: fallbackDoctors,
                fallback: true,
                originalError: 'JSON parsing failed'
            });
        }
        
        // Validate and structure the response
        if (JSONResp.doctors && Array.isArray(JSONResp.doctors)) {
            // Ensure each doctor has required fields
            const validatedDoctors = JSONResp.doctors.map((doctor: any, index: number) => ({
                id: doctor.id || index + 1,
                name: doctor.name || doctor.specialist || 'Unknown Doctor',
                specialty: doctor.specialty || doctor.specialist || 'General Medicine',
                description: doctor.description || 'Experienced medical professional',
                image: doctor.image || '/default-doctor.jpg'
            }));
            
            return NextResponse.json({ doctors: validatedDoctors });
        } else if (Array.isArray(JSONResp)) {
            // Handle case where response is directly an array
            const validatedDoctors = JSONResp.map((doctor: any, index: number) => ({
                id: doctor.id || index + 1,
                name: doctor.name || doctor.specialist || 'Unknown Doctor',
                specialty: doctor.specialty || doctor.specialist || 'General Medicine',
                description: doctor.description || 'Experienced medical professional',
                image: doctor.image || '/default-doctor.jpg'
            }));
            
            return NextResponse.json({ doctors: validatedDoctors });
        } else {
            throw new Error('Unexpected response structure');
        }
        
    } catch (error) {
        console.error('API Error Details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        });
        
        // Get detailed error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Smart fallback: suggest doctors based on symptoms keywords
        const symptomKeywords = notes.toLowerCase();
        let suggestedDoctors: typeof AIDoctorAgents = [];
        
        // Simple keyword matching for better suggestions
        if (symptomKeywords.includes('throat') || symptomKeywords.includes('cough') || symptomKeywords.includes('voice')) {
            suggestedDoctors = AIDoctorAgents.filter(doctor => 
                doctor.specialist.toLowerCase().includes('ent') || 
                doctor.specialist.toLowerCase().includes('general')
            ).slice(0, 3);
        } else if (symptomKeywords.includes('heart') || symptomKeywords.includes('chest') || symptomKeywords.includes('cardiac')) {
            suggestedDoctors = AIDoctorAgents.filter(doctor => 
                doctor.specialist.toLowerCase().includes('cardiologist') || 
                doctor.specialist.toLowerCase().includes('general')
            ).slice(0, 3);
        } else if (symptomKeywords.includes('skin') || symptomKeywords.includes('rash') || symptomKeywords.includes('allergy')) {
            suggestedDoctors = AIDoctorAgents.filter(doctor => 
                doctor.specialist.toLowerCase().includes('dermatologist') || 
                doctor.specialist.toLowerCase().includes('general')
            ).slice(0, 3);
        } else if (symptomKeywords.includes('eye') || symptomKeywords.includes('vision') || symptomKeywords.includes('sight')) {
            suggestedDoctors = AIDoctorAgents.filter(doctor => 
                doctor.specialist.toLowerCase().includes('ophthalmologist') || 
                doctor.specialist.toLowerCase().includes('general')
            ).slice(0, 3);
        }
        
        // If no specific match found, use first available doctors
        if (suggestedDoctors.length === 0) {
            suggestedDoctors = AIDoctorAgents.slice(0, 3);
        }
        
        // Format the response
        const fallbackDoctors = suggestedDoctors.map(doctor => ({
            id: doctor.id,
            name: doctor.specialist,
            specialty: doctor.specialist,
            description: doctor.description,
            image: doctor.image
        }));
        
        return NextResponse.json({ 
            doctors: fallbackDoctors,
            fallback: true,
            error: errorMessage,
            errorType: 'API_ERROR'
        });
    }
}
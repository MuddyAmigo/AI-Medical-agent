import { NextResponse, NextRequest } from "next/server";
import db from "@/config/db";
import { sessionChatsTable } from "@/config/schema";
import { eq } from "drizzle-orm"; // Add this import
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '@clerk/nextjs/server'
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
    const { notes, selectedDoctor } = await request.json();
    
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const sessionId = uuidv4();
        
        const response = await db.insert(sessionChatsTable).values({
            sessionId: sessionId,
            createdBy: user?.primaryEmailAddress?.emailAddress || '',
            notes: notes,
            selectedDoctor: JSON.stringify(selectedDoctor),
            createdOn: new Date().toISOString(),
        }).returning();

        return NextResponse.json({ 
            success: true, 
            sessionId: sessionId,
            data: response[0] 
        });
        
    } catch (error) {
        console.error('Error saving session chat:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to save session chat',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!sessionId) {
        return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 });
    }

    if(sessionId =='all'){
        try {
        const session = await db.select().from(sessionChatsTable)
            .where(eq(sessionChatsTable.createdBy, user?.primaryEmailAddress?.emailAddress || ''))
            .orderBy(desc(sessionChatsTable.id)); 

        return NextResponse.json({ success: true, data: session });
    } catch (error) {
        console.error('Error fetching session chat:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch session chat',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }

    }else{
        try {
        const session = await db.select().from(sessionChatsTable)
            .where(eq(sessionChatsTable.sessionId, sessionId)); // Removed @ts-ignore

        if (!session || session.length === 0) {
            return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: session[0] });
    } catch (error) {
        console.error('Error fetching session chat:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch session chat',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
    }



    
}
// page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Assuming these components are located relative to this page file
import AddNewSessionDialog from '../_component/AddNewSessionDialog';
import ViewReportDialogue from '../_component/ViewReportDialog';

// Assuming the SessionDetail type is exported from this file
import { SessionDetail } from '../medical-agent/[sessionid]/page';

// -----------------------------------------------------------------------------
// HistoryTable Component
// -----------------------------------------------------------------------------

type HistoryTableProps = {
    historyList: SessionDetail[]
}

function HistoryTable({ historyList }: HistoryTableProps) {
  return (
    <div>
        <Table>
            <TableCaption>Previous Consultation Reports</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">AI Medical Specialist</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.isArray(historyList) && historyList.length > 0 ? (
                    historyList.map((record: SessionDetail, index: number) => (
                    <TableRow key={record.id ?? index}>
                        <TableCell className="font-medium">
                            {record.selectedDoctor?.specialty || "N/A"}
                        </TableCell>
                        <TableCell>{record.notes || "No description"}</TableCell>
                        <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                        <TableCell className="text-right">
                            <ViewReportDialogue record={record}/>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                            No reports available
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Main History Page Component (basically HistoryList without collapseble table)
// -----------------------------------------------------------------------------

export default function History() {
    const [historylist, setHistorylist] = useState<SessionDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetHistoryList();
    }, []);

    const GetHistoryList = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/session-chat?sessionId=all');
            if (result.data && result.data.success) {
                setHistorylist(result.data.data);
            } else {
                toast.error("Failed to fetch history.");
                setHistorylist([]); // Ensure list is empty on failure
            }
        } catch (error) {
            console.error("Error fetching history list:", error);
            toast.error("An error occurred while fetching your consultation history.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='mt-10 flex justify-center items-center'>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className='mt-10'>
            {historylist.length === 0 ? (
                <div className='flex flex-col items-center justify-center p-7 border border-dashed rounded-2xl'>
                    <Image src={'/medical-assistance.png'} alt='empty'
                        width={150}
                        height={150}
                    />
                    <h2 className='text-xl font-bold mt-2'>No Recent Consultations</h2>
                    <p>It looks like you haven't consulted with any doctor yet</p>
                    <AddNewSessionDialog />
                </div>
            ) : (
                <div>
                    <HistoryTable historyList={historylist} />
                </div>
            )}
        </div>
    );
}
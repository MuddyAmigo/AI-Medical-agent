"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { AddNewSessionDialog } from './AddNewSessionDialog';
import { SessionDetail } from '../medical-agent/[sessionid]/page';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import ViewReportDialog from './ViewReportDialog';

// Define Props for the HistoryTable component
type HistoryTableProps = {
    historyList: SessionDetail[];
};

// The number of rows to display initially
const INITIAL_VISIBLE_ROWS = 3;

// Helper component for the table
function HistoryTable({ historyList }: HistoryTableProps) {
    // State to keep track of how many rows are currently visible
    const [visibleRows, setVisibleRows] = useState(INITIAL_VISIBLE_ROWS);

    // Function to show all rows
    const showMore = () => {
        setVisibleRows(historyList.length);
    };

    // Function to collapse back to the initial number of rows
    const showLess = () => {
        setVisibleRows(INITIAL_VISIBLE_ROWS);
    }

    // Use slice to get only the records that should be displayed
    const displayedHistory = historyList.slice(0, visibleRows);

    return (
        <div>
            <Table>
                <TableCaption>A list of your previous consultation reports.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">AI Medical Specialist</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayedHistory.map((record: SessionDetail) => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">
                                {record.selectedDoctor?.specialty || "N/A"}
                            </TableCell>
                            <TableCell>{record.notes || "No description"}</TableCell>
                            <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                            <TableCell className="text-right">
                                <ViewReportDialog record={record} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {/* Only show the footer with the button if there are more records than the initial count */}
                {historyList.length > INITIAL_VISIBLE_ROWS && (
                     <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                {visibleRows < historyList.length ? (
                                    <Button variant="link" onClick={showMore}>
                                        Show More ({historyList.length - visibleRows} remaining)
                                    </Button>
                                ) : (
                                    <Button variant="link" onClick={showLess}>
                                        Show Less
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

// Main component exported by default
export default function HistoryList() {
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
                setHistorylist([]);
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
        )
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

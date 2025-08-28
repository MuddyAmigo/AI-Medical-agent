import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {SessionDetail} from '../medical-agent/[sessionid]/page'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import ViewReportDialogue from './ViewReportDialog'


type Props={
    historyList:SessionDetail[]
}

export default function HistoryTable({historyList}:Props) {
  return (
    <div>
        <Table>
            <TableCaption>Previos Consultation Reports</TableCaption>
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
                       <ViewReportDialogue  record={record}/>
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
  )
}

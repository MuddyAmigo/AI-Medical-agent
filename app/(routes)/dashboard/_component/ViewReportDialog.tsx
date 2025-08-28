import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { SessionDetail } from '../medical-agent/[sessionid]/page';
import { Stethoscope, User, Calendar, FileText, Pill, ListChecks, Activity, Clock, AlertTriangle, Info } from 'lucide-react';

type Props = {
    record: SessionDetail;
};

// This interface defines the expected structure of the JSON report object.
interface ReportData {
    sessionId: string;
    agent: string;
    user: string;
    timestamp: string;
    chiefComplaint: string;
    summary: string;
    symptoms: string[];
    duration: string;
    severity: string;
    medicationsMentioned: string[];
    recommendations: string[];
}

// A reusable component for displaying each section of the report.
const ReportSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-10 h-10 mt-1 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
            {icon}
        </div>
        <div className="ml-4 flex-grow">
            <h3 className="text-md font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
            <div className="text-gray-800 mt-1">
                {children}
            </div>
        </div>
    </div>
);

// A helper component to render lists with a fallback for empty arrays.
const BulletList = ({ items }: { items: string[] | undefined }) => {
    if (!items || items.length === 0) {
        return <p className="text-gray-500 italic">None specified</p>;
    }
    return (
        <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
            ))}
        </ul>
    );
};

export default function ViewReportDialog({ record }: Props) {
    // The 'report' field is a JSON string, so we useMemo to parse it safely once.
    const reportData: ReportData | null = React.useMemo(() => {
        try {
            if (!record.report) return null;
            const parsedReport = typeof record.report === 'string'
                ? JSON.parse(record.report)
                : record.report;
            return parsedReport;
        } catch (error) {
            console.error("Failed to parse report JSON:", error);
            return null;
        }
    }, [record.report]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 font-semibold">
                    View Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-xl shadow-2xl">
                <DialogHeader className="p-6 bg-gray-50 border-b border-gray-200 rounded-t-xl">
                    <DialogTitle asChild>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FileText className="w-7 h-7 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-gray-900">AI Consultation Report</h2>
                                <p className="text-sm text-gray-500">
                                    A summary of the automated medical consultation.
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {reportData ? (
                    <div className="p-8">
                        {/* Section 1: Session Info */}
                        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                             <ReportSection icon={<Info size={20} />} title="Session Info">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-500" /><strong>Patient:</strong><span className="ml-2">{reportData.user || 'Anonymous'}</span></div>
                                    <div className="flex items-center"><Stethoscope className="w-4 h-4 mr-2 text-gray-500" /><strong>AI Agent:</strong><span className="ml-2">{reportData.agent || 'N/A'}</span></div>
                                    <div className="flex items-center col-span-2"><Calendar className="w-4 h-4 mr-2 text-gray-500" /><strong>Date:</strong><span className="ml-2">{new Date(reportData.timestamp).toLocaleString()}</span></div>
                                </div>
                            </ReportSection>
                        </div>

                        <div className="space-y-8">
                            {/* Section 2: Chief Complaint & Summary */}
                            <ReportSection icon={<FileText size={20} />} title="Chief Complaint">
                                <p className="font-semibold text-lg text-blue-800">{reportData.chiefComplaint || 'Not specified'}</p>
                            </ReportSection>

                             <ReportSection icon={<FileText size={20} />} title="Summary">
                                <p>{reportData.summary || 'No summary available.'}</p>
                            </ReportSection>

                            <hr className="border-gray-200" />

                            {/* Section 3: Symptoms, Duration & Severity */}
                            <ReportSection icon={<Activity size={20} />} title="Symptoms">
                                <BulletList items={reportData.symptoms} />
                            </ReportSection>

                             <ReportSection icon={<Clock size={20} />} title="Duration & Severity">
                                <div className="flex space-x-8">
                                    <p><strong>Duration:</strong> {reportData.duration || 'N/A'}</p>
                                    <p><strong>Severity:</strong> {reportData.severity || 'N/A'}</p>
                                </div>
                            </ReportSection>

                            <hr className="border-gray-200" />

                            {/* Section 4: Medications & Recommendations */}
                             <ReportSection icon={<Pill size={20} />} title="Medications Mentioned">
                                <BulletList items={reportData.medicationsMentioned} />
                            </ReportSection>

                            <div className="!mt-10 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                                <ReportSection icon={<AlertTriangle size={20} className="text-yellow-600"/>} title="AI Recommendations">
                                    <BulletList items={reportData.recommendations} />
                                </ReportSection>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-gray-400 pt-6 mt-8 border-t border-gray-200">
                            <p>Session ID: {reportData.sessionId}</p>
                            <p className="mt-1 font-semibold">
                                Disclaimer: This is an AI-generated report and not a substitute for professional medical advice.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 px-8">
                        <p className="text-gray-600 font-semibold">Report data is not available.</p>
                        <p className="text-sm text-gray-500 mt-1">The report for this session may not have been generated or is in an invalid format.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

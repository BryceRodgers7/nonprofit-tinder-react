// FRONTEND: Resume list component
// Displays saved resumes with view, edit, and delete actions

'use client';

import { useState } from 'react';
import { ResumeData } from './ResumeForm';

interface ResumeListProps {
  resumes: ResumeData[];
  onSelect: (resume: ResumeData) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export default function ResumeList({ resumes, onSelect, onDelete, onRefresh }: ResumeListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
      onRefresh();
    } catch (error) {
      alert('Failed to delete resume. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload a resume to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">
                {resume.fullName || 'Unnamed Resume'}
              </h4>
              <div className="mt-1 text-sm text-gray-600 space-y-1">
                {resume.email && (
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {resume.email}
                  </p>
                )}
                {resume.lastJob && resume.lastCompany && (
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    {resume.lastJob} at {resume.lastCompany}
                  </p>
                )}
                {resume.technicalSkills && resume.technicalSkills.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {resume.technicalSkills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {resume.technicalSkills.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{resume.technicalSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Uploaded: {resume.fileName} 
                {(resume as any).createdAt && ` • ${formatDate((resume as any).createdAt)}`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onSelect(resume)}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => resume.id && handleDelete(resume.id)}
                disabled={deletingId === resume.id}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === resume.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


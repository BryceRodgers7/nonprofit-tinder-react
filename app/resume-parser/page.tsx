// FRONTEND: Main resume parser page
// Integrates file upload, AI extraction, editable form, and resume history

'use client';

import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ResumeForm, { ResumeData } from './components/ResumeForm';
import ResumeList from './components/ResumeList';
import LoadingSpinner from './components/LoadingSpinner';

export default function ResumeParserPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  // Load resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const response = await fetch('/api/resumes');
      const data = await response.json();
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setProcessingStatus('Uploading and extracting text from file...');

    try {
      // Step 1: Upload file and extract text
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload file');
      }

      setIsUploading(false);
      setIsExtracting(true);
      setProcessingStatus('Analyzing resume with AI...');

      // Step 2: Extract structured data using OpenAI
      const extractResponse = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedText: uploadData.extractedText,
          fileName: uploadData.fileName,
          fileType: uploadData.fileType,
        }),
      });

      const extractData = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractData.error || 'Failed to extract resume data');
      }

      setProcessingStatus('');
      setCurrentResume(extractData.resume);
      fetchResumes(); // Refresh the list

    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setProcessingStatus('');
    } finally {
      setIsUploading(false);
      setIsExtracting(false);
    }
  };

  const handleSave = async (data: ResumeData) => {
    if (!data.id) {
      throw new Error('No resume ID found');
    }

    const response = await fetch(`/api/resumes/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save resume');
    }

    fetchResumes(); // Refresh the list
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/resumes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete resume');
    }

    if (currentResume?.id === id) {
      setCurrentResume(null);
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the form?')) {
      setCurrentResume(null);
      setError(null);
      setProcessingStatus('');
    }
  };

  const handleSelectResume = (resume: ResumeData) => {
    setCurrentResume(resume);
    setError(null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Resume Parser
          </h1>
          <p className="text-lg text-gray-600">
            Upload a resume to automatically extract and edit key information
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-800">
              <strong>Frontend:</strong> This page and components | <strong>Backend:</strong> API routes in /api
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload and Form */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Upload Resume
              </h2>
              <FileUpload
                onFileSelect={handleFileSelect}
                isUploading={isUploading || isExtracting}
              />
              
              {/* Processing Status */}
              {(isUploading || isExtracting) && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-blue-50 rounded-md">
                  <LoadingSpinner />
                  <span className="text-sm text-blue-800">{processingStatus}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            {/* Form Section */}
            {currentResume && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Edit Information
                </h2>
                <ResumeForm
                  initialData={currentResume}
                  onSave={handleSave}
                  onClear={handleClear}
                />
              </div>
            )}
          </div>

          {/* Right Column: Resume History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                3. Saved Resumes
              </h2>
              <button
                onClick={fetchResumes}
                disabled={isLoadingResumes}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoadingResumes ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {isLoadingResumes ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <ResumeList
                resumes={resumes}
                onSelect={handleSelectResume}
                onDelete={handleDelete}
                onRefresh={fetchResumes}
              />
            )}
          </div>
        </div>

        {/* Instructions Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">1</span>
                <strong>Upload</strong>
              </div>
              <p>Upload your resume in PDF, DOCX, or TXT format (max 10MB)</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">2</span>
                <strong>AI Extraction</strong>
              </div>
              <p>GPT-4 analyzes the resume and extracts key information automatically</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">3</span>
                <strong>Edit & Save</strong>
              </div>
              <p>Review, edit the extracted data, and save to your Supabase database</p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Setup Required</h3>
          <p className="text-sm text-yellow-800">
            Before using this application, make sure to:
          </p>
          <ol className="mt-2 ml-5 list-decimal text-sm text-yellow-800 space-y-1">
            <li>Copy <code className="bg-yellow-100 px-1 rounded">env-template.txt</code> to <code className="bg-yellow-100 px-1 rounded">.env.local</code></li>
            <li>Fill in your Supabase DATABASE_URL</li>
            <li>Fill in your OpenAI OPENAI_API_KEY</li>
            <li>Run <code className="bg-yellow-100 px-1 rounded">npx prisma migrate dev</code> to create database tables</li>
          </ol>
        </div>
      </div>
    </div>
  );
}


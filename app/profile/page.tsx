// FRONTEND: Main non-profit organization profile page
// Allows users to create and edit their organization profile via file upload or manual entry

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from './components/ProtectedRoute';
import FileUpload from './components/FileUpload';
import ProfileForm, { ProfileData } from './components/ProfileForm';
import LoadingSpinner from './components/LoadingSpinner';

function ProfilePageContent() {
  const { user, token, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  // Load profile on mount
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        } else {
          // Initialize empty profile if none exists
          setProfile({
            organizationName: null,
            ein: null,
            missionStatement: null,
            yearFounded: null,
            locationServed: null,
            biggestAccomplishment: null,
            oneSentenceSummary: null,
            legalDesignation: null,
            primaryCauseAreas: [],
            populations: [],
            geographicalFocus: null,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setProcessingStatus('Uploading and extracting text from proposal...');

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
      setProcessingStatus('Analyzing proposal with AI...');

      // Step 2: Extract structured data using OpenAI
      const extractResponse = await fetch('/api/profile/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          extractedText: uploadData.extractedText,
          fileName: uploadData.fileName,
          s3Key: uploadData.s3Key,
          s3Url: uploadData.s3Url,
        }),
      });

      const extractData = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractData.error || 'Failed to extract profile data');
      }

      setProcessingStatus('');
      setProfile(extractData.profile);

    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setProcessingStatus('');
    } finally {
      setIsUploading(false);
      setIsExtracting(false);
    }
  };

  const handleSave = async (data: ProfileData) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save profile');
    }

    const result = await response.json();
    setProfile(result.profile);
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Non-Profit Organization Profile
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {user?.name}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log out
            </button>
          </div>
        </div>

        {/* File Upload Section (Optional) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Proposal Document (Optional)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload a proposal document to automatically extract organization information, or skip this and fill out the form manually below.
          </p>
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

        {/* Profile Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Organization Information
          </h2>
          <ProfileForm
            initialData={profile}
            onSave={handleSave}
            showUploadInfo={true}
          />
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Upload a proposal document (PDF, DOCX, or TXT) to automatically extract information</li>
            <li>Or manually fill out the form fields below</li>
            <li>Review and edit any extracted information</li>
            <li>Click "Save Profile" to save your organization's profile</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}


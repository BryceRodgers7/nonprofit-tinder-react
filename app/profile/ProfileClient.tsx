// FRONTEND: Profile Client Component
// Handles interactive profile editing - receives initial data from Server Component

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from './components/ProtectedRoute';
import FileUpload from './components/FileUpload';
import ProfileForm, { ProfileData } from './components/ProfileForm';
import LoadingSpinner from './components/LoadingSpinner';
import NavBar from '@/app/components/NavBar';

interface ProfileClientProps {
  initialProfile: ProfileData | null;
}

function ProfileClientContent({ initialProfile }: ProfileClientProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSavingFile, setIsSavingFile] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(
    initialProfile || {
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
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [fileSavedToProfile, setFileSavedToProfile] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState<{
    file: File;
    fileName: string;
    s3Key?: string;
    s3Url?: string;
    extractedText: string;
    s3Error?: string;
    s3Configured?: boolean;
  } | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setFileSavedToProfile(false);
    setProcessingStatus('Uploading and extracting text from proposal...');

    try {
      // Upload file and extract text (but don't save to profile yet)
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include', // Auth via HttpOnly cookie
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload file');
      }

      // Debug: Log the upload response
      console.log('Upload response:', uploadData);
      console.log('S3 Key:', uploadData.s3Key);
      console.log('S3 URL:', uploadData.s3Url);
      console.log('S3 Error:', uploadData.s3Error);
      console.log('S3 Configured:', uploadData.s3Configured);

      // Check for S3 issues
      if (uploadData.s3Error || !uploadData.s3Key || !uploadData.s3Url) {
        const s3Message = uploadData.s3Error || 'S3 upload failed - no key/url returned';
        console.error('S3 Issue:', s3Message);
        setError(`File uploaded but S3 storage failed: ${s3Message}`);
      }

      // Store the uploaded file data for later saving
      setUploadedFileData({
        file,
        fileName: uploadData.fileName,
        s3Key: uploadData.s3Key,
        s3Url: uploadData.s3Url,
        extractedText: uploadData.extractedText,
        s3Error: uploadData.s3Error,
        s3Configured: uploadData.s3Configured,
      });

      setProcessingStatus('');
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setProcessingStatus('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveFileToProfile = async () => {
    if (!uploadedFileData) return;

    // Validate S3 data before saving
    if (!uploadedFileData.s3Key || !uploadedFileData.s3Url) {
      setError('Cannot save to profile: File was not uploaded to S3 successfully. Please check S3 configuration.');
      return;
    }

    setIsSavingFile(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Debug: Log what we're about to save
      console.log('Saving file reference to profile:', {
        fileName: uploadedFileData.fileName,
        s3Key: uploadedFileData.s3Key,
        s3Url: uploadedFileData.s3Url,
      });

      // Save ONLY file reference (fileName, s3Key, s3Url) - no other profile fields
      const response = await fetch('/api/profile/file', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Auth via HttpOnly cookie
        body: JSON.stringify({
          fileName: uploadedFileData.fileName,
          s3Key: uploadedFileData.s3Key,
          s3Url: uploadedFileData.s3Url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save file to profile');
      }

      const result = await response.json();
      console.log('File reference saved, result:', result.profile);
      
      // Update only the file-related fields in the profile state
      setProfile(prev => {
        if (!prev) return result.profile;
        return {
          ...prev,
          fileName: result.profile.fileName,
          s3Key: result.profile.s3Key,
          s3Url: result.profile.s3Url,
        };
      });
      
      // Mark file as saved and show success message
      setFileSavedToProfile(true);
      setSuccessMessage(`File "${uploadedFileData.fileName}" saved successfully to S3 and database!`);
      
      // Don't clear uploadedFileData - keep it for AI extraction
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error saving file:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSavingFile(false);
    }
  };

  const handleExtractWithAI = async () => {
    if (!uploadedFileData) return;

    setIsExtracting(true);
    setError(null);
    setProcessingStatus('Analyzing proposal with AI...');

    try {
      // Extract structured data using OpenAI
      const extractResponse = await fetch('/api/profile/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Auth via HttpOnly cookie
        body: JSON.stringify({
          extractedText: uploadedFileData.extractedText,
          fileName: uploadedFileData.fileName,
          s3Key: uploadedFileData.s3Key,
          s3Url: uploadedFileData.s3Url,
        }),
      });

      const extractData = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractData.error || 'Failed to extract profile data');
      }

      setProcessingStatus('');
      
      // Merge extracted data with existing profile (don't overwrite saved data)
      setProfile(prev => ({
        ...prev,
        ...extractData.extractedData,
      }));
    } catch (error) {
      console.error('Error extracting data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setProcessingStatus('');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async (data: ProfileData) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Auth via HttpOnly cookie
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save profile');
    }

    const result = await response.json();
    setProfile(result.profile);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Non-Profit Organization Profile
          </h1>
        </div>

        {/* File Upload Section (Optional) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Proposal Document (Optional)
              </h2>
              <p className="text-sm text-gray-600">
                Upload a proposal document to automatically extract organization information, or skip this and fill out the form manually below.
              </p>
            </div>
            
            {/* Show saved filename */}
            {profile?.fileName && (
              <div className="ml-4 flex-shrink-0 bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-xs text-green-600 font-medium mb-1">Saved File:</p>
                <p className="text-sm text-green-800 font-semibold">{profile.fileName}</p>
                {profile.s3Url && (
                  <a 
                    href={profile.s3Url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    View file
                  </a>
                )}
              </div>
            )}
          </div>

          <FileUpload
            onFileSelect={handleFileSelect}
            isUploading={isUploading || isExtracting || isSavingFile}
          />

          {/* Show uploaded file info and action buttons */}
          {uploadedFileData && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Uploaded:</strong> {uploadedFileData.fileName}
              </p>
              
              {/* S3 Status Info */}
              {uploadedFileData.s3Error && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <strong>⚠️ S3 Warning:</strong> {uploadedFileData.s3Error}
                </div>
              )}
              
              {uploadedFileData.s3Key && uploadedFileData.s3Url && (
                <div className="mb-3 text-xs text-green-700">
                  ✓ Successfully uploaded to S3
                </div>
              )}
              
              <div className="flex gap-3 items-center">
                {!fileSavedToProfile ? (
                  <button
                    onClick={handleSaveFileToProfile}
                    disabled={isSavingFile || !uploadedFileData.s3Key || !uploadedFileData.s3Url}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!uploadedFileData.s3Key || !uploadedFileData.s3Url ? 'S3 upload required to save' : ''}
                  >
                    {isSavingFile ? 'Saving...' : 'Save to Profile'}
                  </button>
                ) : (
                  successMessage && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                      ✓ Saved to profile
                    </div>
                  )
                )}
                <button
                  onClick={handleExtractWithAI}
                  disabled={isExtracting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExtracting ? 'Extracting...' : 'Extract Data with AI'}
                </button>
              </div>
            </div>
          )}

          {/* Processing Status */}
          {(isUploading || isExtracting) && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-blue-50 rounded-md">
              <LoadingSpinner />
              <span className="text-sm text-blue-800">{processingStatus}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Help Section - Moved here */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Upload a proposal document (PDF, DOCX, or TXT)</li>
            <li>Click "Save to Profile" to save the file reference to S3</li>
            <li>Click "Extract Data with AI" to auto-populate the form fields below (does NOT save yet)</li>
            <li>Review and edit the extracted information in the form</li>
            <li>Click "Save Profile" at the bottom to save all your changes to the database</li>
          </ol>
        </div>

        {/* Profile Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Organization Information
          </h2>
          <ProfileForm
            initialData={profile}
            onSave={handleSave}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
  return (
    <ProtectedRoute>
      <ProfileClientContent initialProfile={initialProfile} />
    </ProtectedRoute>
  );
}


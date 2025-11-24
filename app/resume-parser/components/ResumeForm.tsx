// FRONTEND: Resume form component
// Editable form for all resume fields with save functionality

'use client';

import { useState, useEffect } from 'react';
import SkillsInput from './SkillsInput';
import LoadingSpinner from './LoadingSpinner';

export interface ResumeData {
  id?: string;
  fileName?: string;
  fileType?: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  lastJob: string | null;
  lastCompany: string | null;
  yearsExperience: string | null;
  technicalSkills: string[];
  education: string | null;
  summary: string | null;
}

interface ResumeFormProps {
  initialData: ResumeData | null;
  onSave: (data: ResumeData) => Promise<void>;
  onClear: () => void;
}

export default function ResumeForm({ initialData, onSave, onClear }: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeData>({
    fullName: null,
    email: null,
    phone: null,
    lastJob: null,
    lastCompany: null,
    yearsExperience: null,
    technicalSkills: [],
    education: null,
    summary: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await onSave(formData);
      setSaveMessage({ type: 'success', text: 'Resume saved successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save resume. Please try again.' });
    } finally {
      setIsSaving(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleChange = (field: keyof ResumeData, value: string | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!initialData) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Work Experience Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Job Title
            </label>
            <input
              type="text"
              value={formData.lastJob || ''}
              onChange={(e) => handleChange('lastJob', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Company
            </label>
            <input
              type="text"
              value={formData.lastCompany || ''}
              onChange={(e) => handleChange('lastCompany', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="text"
              value={formData.yearsExperience || ''}
              onChange={(e) => handleChange('yearsExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
        <SkillsInput
          skills={formData.technicalSkills}
          onChange={(skills) => handleChange('technicalSkills', skills)}
        />
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
        <textarea
          value={formData.education || ''}
          onChange={(e) => handleChange('education', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter education details..."
        />
      </div>

      {/* Summary Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
        <textarea
          value={formData.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter professional summary..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onClear}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <LoadingSpinner />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`p-4 rounded-md ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {saveMessage.text}
        </div>
      )}
    </form>
  );
}


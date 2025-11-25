// FRONTEND: Profile form component
// Editable form for all non-profit organization profile fields

'use client';

import { useState, useEffect } from 'react';
import MultiSelect from './MultiSelect';
import LoadingSpinner from './LoadingSpinner';
import { 
  PRIMARY_CAUSE_AREAS, 
  POPULATIONS, 
  GEOGRAPHIC_FOCUS_OPTIONS, 
  LEGAL_DESIGNATION_OPTIONS 
} from '@/lib/profile-constants';

export interface ProfileData {
  id?: string;
  userId?: string;
  fileName?: string | null;
  s3Key?: string | null;
  s3Url?: string | null;
  organizationName: string | null;
  ein: string | null;
  missionStatement: string | null;
  yearFounded: string | null;
  locationServed: string | null;
  biggestAccomplishment: string | null;
  oneSentenceSummary: string | null;
  legalDesignation: string | null;
  primaryCauseAreas: string[];
  populations: string[];
  geographicalFocus: string | null;
}

interface ProfileFormProps {
  initialData: ProfileData | null;
  onSave: (data: ProfileData) => Promise<void>;
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
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
      setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleChange = (field: keyof ProfileData, value: string | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={formData.organizationName || ''}
              onChange={(e) => handleChange('organizationName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              EIN (Tax ID)
            </label>
            <input
              type="text"
              value={formData.ein || ''}
              onChange={(e) => handleChange('ein', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Founded
            </label>
            <input
              type="text"
              value={formData.yearFounded || ''}
              onChange={(e) => handleChange('yearFounded', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal Designation
            </label>
            <select
              value={formData.legalDesignation || ''}
              onChange={(e) => handleChange('legalDesignation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a designation</option>
              {LEGAL_DESIGNATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mission & Summary Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission & Summary</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission Statement
            </label>
            <textarea
              value={formData.missionStatement || ''}
              onChange={(e) => handleChange('missionStatement', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your organization's mission statement..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What We Do (One Sentence)
            </label>
            <input
              type="text"
              value={formData.oneSentenceSummary || ''}
              onChange={(e) => handleChange('oneSentenceSummary', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Summarize your work in one sentence..."
            />
          </div>
        </div>
      </div>

      {/* Service Area Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Served
            </label>
            <input
              type="text"
              value={formData.locationServed || ''}
              onChange={(e) => handleChange('locationServed', e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geographical Focus
            </label>
            <select
              value={formData.geographicalFocus || ''}
              onChange={(e) => handleChange('geographicalFocus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select geographical focus</option>
              {GEOGRAPHIC_FOCUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Focus Areas Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelect
            values={formData.primaryCauseAreas}
            onChange={(values) => handleChange('primaryCauseAreas', values)}
            options={PRIMARY_CAUSE_AREAS}
            label="Primary Cause Areas"
            placeholder="Select cause areas..."
          />
          <MultiSelect
            values={formData.populations}
            onChange={(values) => handleChange('populations', values)}
            options={POPULATIONS}
            label="Populations Served"
            placeholder="Select populations..."
          />
        </div>
      </div>

      {/* Accomplishments Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accomplishments</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biggest Accomplishment
          </label>
          <textarea
            value={formData.biggestAccomplishment || ''}
            onChange={(e) => handleChange('biggestAccomplishment', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your organization's most significant achievement..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end pt-4 border-t">
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
            'Save Profile'
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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, Upload, X, Crosshair } from 'lucide-react';
import { useIssueStore } from '../../store/issueStore';
import { useAuthStore } from '../../store/authStore';
import { ISSUE_CATEGORIES } from '../../types';
import MapSelector from './MapSelector';

interface ReportIssueForm {
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const { addIssue } = useIssueStore();
  const { user } = useAuthStore();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ReportIssueForm>({
    defaultValues: {
      location: {
        lat: 23.2599,
        lng: 77.4126,
        address: ''
      },
      severity: 'medium'
    }
  });

  const selectedCategory = watch('category');
  const currentLocation = watch('location');
  const selectedSeverity = watch('severity');

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setValue('location', location);
    setShowMap(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue('location', {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(() => 
        'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=400'
      );
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReportIssueForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addIssue({
        title: data.title,
        description: data.description,
        category: data.category,
        severity: data.severity,
        status: 'open',
        location: data.location,
        media: uploadedImages,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        reportedBy: user.id,
        reporterName: user.name,
        isAnonymous: false
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to report issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
              <p className="text-gray-600">
                Help improve your community by reporting civic issues
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  {...register('category', { required: 'Please select a category' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {ISSUE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="Others">Others</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={selectedCategory ? `${selectedCategory} issue in your area` : 'Brief description of the issue'}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedCategory === 'Others' ? 'Detailed Description (Please describe the issue) *' : 'Detailed Description *'}
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={selectedCategory === 'Others' ? 6 : 4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    selectedCategory === 'Others' 
                      ? "Please describe the issue in detail, including what type of problem it is, where exactly it's located, and why it needs attention..."
                      : "Please provide detailed information about the issue, including any relevant context or urgency..."
                  }
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      {...register('location.address', { required: 'Location is required' })}
                      type="text"
                      className="w-full pl-10 pr-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter or search for the location"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="absolute right-20 top-2 px-3 py-2 text-xs bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Crosshair className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Pin on Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>Use Current</span>
                    </button>
                  </div>
                  
                  {currentLocation.address && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Selected Location:</strong> {currentLocation.address}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
                {errors.location?.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
                )}
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="relative">
                    <input
                      {...register('severity')}
                      type="radio"
                      value="low"
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedSeverity === 'low'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="text-center">
                        <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-green-500" />
                        <p className="font-medium text-gray-900">Low</p>
                        <p className="text-xs text-gray-600 mt-1">Minor issue, can wait</p>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      {...register('severity')}
                      type="radio"
                      value="medium"
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedSeverity === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="text-center">
                        <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-yellow-500" />
                        <p className="font-medium text-gray-900">Medium</p>
                        <p className="text-xs text-gray-600 mt-1">Needs attention soon</p>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      {...register('severity')}
                      type="radio"
                      value="high"
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedSeverity === 'high'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="text-center">
                        <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-red-500" />
                        <p className="font-medium text-gray-900">High</p>
                        <p className="text-xs text-gray-600 mt-1">Urgent, immediate action needed</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload photos to help officials understand the issue better
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photos
                  </label>
                </div>

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Reporting...' : 'Report Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Map Modal */}
        {showMap && (
          <MapSelector
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowMap(false)}
            initialLocation={currentLocation}
          />
        )}
      </div>
    </div>
  );
};

export default ReportIssue;
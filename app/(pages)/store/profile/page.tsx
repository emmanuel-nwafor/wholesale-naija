// app/(seller)/profile/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Camera } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import ProfileSidebar from '@/app/components/sidebar/SellersProfileSidebar';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import OkaySuccessModal from '@/app/components/modals/OkaySuccessModal';
import Image from 'next/image';

interface UserProfile {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  profilePicture?: {
    url: string;
    // Add other fields if necessary
  };
}

interface ProfileResponse {
  user: UserProfile;
}

interface UploadResponse {
  uploaded: Array<{
    url: string;
  }>;
}

export default function SellerProfilePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Added state back in for control, but now it's used in loadProfile
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profilePicture: '',
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const data = await fetchWithToken<ProfileResponse>('/auth/profile');
      const u = data.user;

      setForm({
        fullName: u.fullName || '',
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        phone: u.phone || '',
        email: u.email || '',
        profilePicture: u.profilePicture?.url || '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      // FIX: Used UploadResponse interface (L70)
      const res = await fetchWithToken<UploadResponse>('/uploads/single', {
        method: 'POST',
        body: fd,
      });

      const newUrl = res.uploaded[0].url;

      // Show image immediately with cache buster
      setForm((prev) => ({
        ...prev,
        profilePicture: newUrl + '?t=' + Date.now(),
      }));
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // FIX: Used ProfileResponse interface (L92)
      const response = await fetchWithToken<ProfileResponse>('/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          // Remove cache buster before saving URL
          profilePicture: form.profilePicture.replace(/\?.*$/, ''),
        }),
      });

      // Update form
      const u = response.user;
      setForm({
        fullName: u.fullName || '',
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        phone: u.phone || '',
        email: u.email || '',
        profilePicture: u.profilePicture?.url || '',
      });

      setIsEditing(false);
      setShowSuccess(true);
    } catch (error: unknown) {
      // FIX: Changed 'err: any' to 'error: unknown' (L117)
      const message =
        error instanceof Error ? error.message : 'Failed to save profile';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const initials =
    form.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'JJ';

  return (
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
          <div className="max-w-5xl">
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                className="mb-6 flex items-center gap-2 text-sm font-medium hover:bg-gray-100 rounded-xl p-3"
              >
                <Menu className="w-5 h-5" /> Profile Info
              </button>
            )}

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-64">
                <ProfileSidebar
                  isMobile={isMobile}
                  isOpen={menuOpen}
                  setIsOpen={setMenuOpen}
                />
              </div>

              <div className="flex-1 bg-white rounded-2xl p-6">
                <div className="flex justify-between items-start mb-8">
                  <h1 className="text-xl font-semibold">Profile Info</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border hover:cursor-pointer border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Avatar Section */}
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                      {isLoadingProfile ? (
                        <div className="w-6 h-6 border-2 border-t-gray-600 rounded-full animate-spin" />
                      ) : form.profilePicture ? (
                        // FIX: Replaced <img> with Next.js <Image /> (L176)
                        <Image
                          src={form.profilePicture}
                          alt="Profile"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100px, 100px" // Adjusted for the 24x24 container
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>

                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            uploadPhoto(e.target.files[0])
                          }
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="absolute bottom-0 right-0 p-2 bg-white rounded-full border shadow-sm hover:bg-gray-50"
                        >
                          {uploading ? (
                            <div className="w-4 h-4 border-2 border-t-blue-600 rounded-full animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="ml-6">
                    <h2 className="text-lg font-semibold">
                      {form.fullName || 'Your Name'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update your photo and personal details.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl ${
                          isEditing
                            ? 'bg-white border border-gray-300'
                            : 'bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl ${
                          isEditing
                            ? 'bg-white border border-gray-300'
                            : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl ${
                        isEditing
                          ? 'bg-white border border-gray-300'
                          : 'bg-gray-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl ${
                        isEditing
                          ? 'bg-white border border-gray-300'
                          : 'bg-gray-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        loadProfile();
                      }}
                      className="px-6 py-3 hover:cursor-pointer border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-8 py-3 hover:cursor-pointer bg-slate-900 text-white rounded-xl disabled:opacity-70"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <OkaySuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Profile Updated!"
      />
    </div>
  );
}

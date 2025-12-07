'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Camera } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import OkaySuccessModal from '@/app/components/modals/OkaySuccessModal';
import CarouselBanner from '@/app/components/carousels/CarouselBanner';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import Image from 'next/image';

// Interface
interface ProfilePicture {
  url: string;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  profilePicture?: ProfilePicture;
  dateOfBirth?: string;
}

interface ProfileResponse {
  user: UserData;
}

interface UploadResponse {
  uploaded: { url: string }[];
}

export default function BuyersProfilePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profilePicture: '',
    dateOfBirth: '',
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
      setIsLoading(true);
      const data = await fetchWithToken<ProfileResponse>('/auth/profile');
      const u = data.user;
      setForm({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        phone: u.phone || '',
        email: u.email || '',
        profilePicture: u.profilePicture?.url || '',
        dateOfBirth: u.dateOfBirth || '',
      });
    } catch {
      console.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetchWithToken<UploadResponse>('/uploads/single', {
        method: 'POST',
        body: fd,
      });
      setForm((prev) => ({
        ...prev,
        profilePicture: res.uploaded?.[0]?.url
          ? res.uploaded[0].url + '?t=' + Date.now()
          : prev.profilePicture,
      }));
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

const handleSave = async () => {
 setSaving(true);
 try {
 await fetchWithToken('/auth/profile', {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 firstName: form.firstName,
 lastName: form.lastName,
 phone: form.phone,
 profilePicture: form.profilePicture.replace(/\?.*$/, ''),
 dateOfBirth: form.dateOfBirth,
 }),
 });
 setIsEditing(false);
 setShowSuccess(true);
 loadProfile();
 } catch (err) { 
 const errorMsg =
 (err as { message?: string })?.message || 'Failed to save profile';
 alert(errorMsg);
 } finally {
 setSaving(false);
 }
 };

  return (
    <>
      <Header />
      <DynamicHeader />
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl p-3"
                >
                  <Menu className="w-5 h-5" /> Menu
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {isMobile && (
                  <BuyersProfileSidebar
                    isMobile={true}
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                  />
                )}
                {!isMobile && (
                  <BuyersProfileSidebar
                    isMobile={false}
                    isOpen={true}
                    setIsOpen={() => {}}
                  />
                )}

                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Profile Info</h1>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative">
                      <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
                        {form.profilePicture ? (
                          <Image
                            src={form.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                            height={150}
                            width={150}
                          />
                        ) : (
                          // Display initials if no picture
                          (form.firstName[0] || '') + (form.lastName[0] || '')
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
                            className="absolute bottom-1 right-1 p-3 bg-white rounded-full border-2 border-white shadow-lg"
                          >
                            <Camera className="w-5 h-5 text-gray-600" />
                          </button>
                        </>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {form.firstName} {form.lastName}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Update your photo and personal details.
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  {isLoading ? (
                    <p className="text-gray-500">Loading profile data...</p>
                  ) : (
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) =>
                              setForm({ ...form, firstName: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border transition ${
                              isEditing
                                ? 'border-gray-300 bg-white'
                                : 'border-transparent bg-gray-50'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) =>
                              setForm({ ...form, lastName: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border transition ${
                              isEditing
                                ? 'border-gray-300 bg-white'
                                : 'border-transparent bg-gray-50'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={form.dateOfBirth}
                          onChange={(e) =>
                            setForm({ ...form, dateOfBirth: e.target.value })
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3.5 rounded-xl border transition ${
                            isEditing
                              ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                              : 'border-transparent bg-gray-50'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className={`w-full px-4 py-3.5 rounded-xl border transition ${
                            isEditing
                              ? 'border-gray-300 bg-white'
                              : 'border-transparent bg-gray-50'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          disabled
                          className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent"
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end gap-4 pt-6">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              loadProfile();
                            }}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-70"
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </main>
          <CarouselBanner />
        </div>

        <OkaySuccessModal
          show={showSuccess}
          onClose={() => setShowSuccess(false)}
          title="Profile Updated!"
        />
      </div>
    </>
  );
}

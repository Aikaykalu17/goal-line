"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/app/components/Spinner";
import SpinnerMini from "@/app/components/SpinnerMini";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Admin&background=0d7a5f&color=fff&size=256";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (!active) return;

        setUser(authUser);
        const nextAvatar =
          authUser?.user_metadata?.avatar_url ||
          authUser?.user_metadata?.avatar ||
          authUser?.user_metadata?.picture ||
          DEFAULT_AVATAR;

        setAvatarUrl(nextAvatar);
      } catch (error) {
        setMessage(error?.message || "Could not load admin profile.");
        setMessageType("error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return "";

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (!selectedFile) return;

      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedFile, previewUrl]);

  const displayName = useMemo(() => {
    return user?.user_metadata?.full_name || user?.email || "Admin";
  }, [user]);

  async function handleUpload() {
    if (!selectedFile || !user?.id) {
      setMessage("Choose a profile photo first.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (selectedFile.size > 2 * 1024 * 1024) {
        throw new Error("Please upload an image smaller than 2MB.");
      }

      const fileExt = selectedFile.name.split(".").pop() || "png";
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
          contentType: selectedFile.type || "image/png",
        });

      if (uploadError) {
        if (
          uploadError.message?.toLowerCase().includes("bucket") ||
          uploadError.message?.toLowerCase().includes("not found")
        ) {
          throw new Error(
            "Create a public Supabase storage bucket named 'avatars' before uploading profile photos.",
          );
        }

        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSelectedFile(null);
      setMessage("Profile picture updated successfully.");
      setMessageType("error");
    } catch (error) {
      setMessage(error?.message || "Could not update profile picture.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      <div>
        <h1 className="text-xl font-bold text-(--text) md:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Update your admin profile picture.
        </p>
      </div>

      {message && (
        <div
          className={`mt-4 rounded-xl border px-3 py-2 text-xs ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="w-full min-h-75 rounded-2xl border border-gray-200 bg-white p-4">
          <Spinner
            label="Loading settings"
            fullScreen={false}
            variant="inner-page"
          />
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <img
                src={previewUrl || avatarUrl}
                alt="Admin profile"
                className="h-24 w-24 rounded-full border-4 border-emerald-100 object-cover shadow-sm sm:h-28 sm:w-28"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{displayName}</p>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@goolline.com"}
              </p>
            </div>
          </div>

          <div className="mt-6 max-w-md space-y-4">
            <label className="block text-xs font-medium text-gray-700">
              Choose profile photo
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
                className="mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-(--forest) file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white text-xs"
              />
            </label>

            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || saving}
              className="w-full rounded-xl bg-(--forest) px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer flex items-center text-center justify-center gap-4"
            >
              {saving ? (
                <>
                  <SpinnerMini />
                  Uploading...
                </>
              ) : (
                "Save profile picture"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

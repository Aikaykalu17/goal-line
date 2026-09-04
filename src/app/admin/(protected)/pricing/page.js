"use client";

import { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";
import { getPricingConfigAction, savePricingAction } from "./actions";
import SpinnerMini from "@/app/components/SpinnerMini";
import formatNumber from "../utils/formatNumber";
import parseNumber from "../utils/parseNumber";

const DEFAULT_FIELDS = {
  weekday_day: 5000,
  weekday_night: 6000,
  weekend_day: 7000,
  weekend_night: 8000,
};

export default function PricingPage() {
  const [form, setForm] = useState(DEFAULT_FIELDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPricing() {
      try {
        const pricing = await getPricingConfigAction();
        setForm({
          weekday_day: Number(
            pricing?.weekday_day ?? DEFAULT_FIELDS.weekday_day,
          ),
          weekday_night: Number(
            pricing?.weekday_night ?? DEFAULT_FIELDS.weekday_night,
          ),
          weekend_day: Number(
            pricing?.weekend_day ?? DEFAULT_FIELDS.weekend_day,
          ),
          weekend_night: Number(
            pricing?.weekend_night ?? DEFAULT_FIELDS.weekend_night,
          ),
        });
      } catch (error) {
        setMessage(error?.message || "Could not load pricing.");
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timeoutId = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [message]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: Number(value || 0) }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      await savePricingAction(form);
      setMessage("Pricing updated successfully.");
    } catch (error) {
      setMessage(error?.message || "Could not save pricing.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-75 rounded-2xl border border-gray-200 bg-(--white) p-4">
        <Spinner
          label="Loading pricing"
          fullScreen={false}
          variant="inner-page"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--text) md:text-2xl">
            Pricing
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Update the rate charged for weekday and weekend sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-(--forest) px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 cursor-pointer flex items-center gap-3"
        >
          {saving ? (
            <>
              <SpinnerMini />
              Saving
            </>
          ) : (
            "Save Pricing"
          )}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">Weekday</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Day rate (₦/hr)
              <input
                type="text"
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                value={formatNumber(form.weekday_day)}
                onChange={(event) =>
                  updateField("weekday_day", parseNumber(event.target.value))
                }
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Night rate (₦/hr)
              <input
                type="text"
                placeholder="0"
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                value={formatNumber(form.weekday_night)}
                onChange={(event) =>
                  updateField("weekday_night", parseNumber(event.target.value))
                }
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">Weekend</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Day rate (₦/hr)
              <input
                type="text"
                placeholder="0"
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                value={formatNumber(form.weekend_day)}
                onChange={(event) =>
                  updateField("weekend_day", parseNumber(event.target.value))
                }
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Night rate (₦/hr)
              <input
                type="text"
                placeholder="0"
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                value={formatNumber(form.weekend_night)}
                onChange={(event) =>
                  updateField("weekend_night", parseNumber(event.target.value))
                }
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

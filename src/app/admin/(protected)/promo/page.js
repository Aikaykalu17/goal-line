"use client";

import { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";
import {
  deletePromoCodeAction,
  getPromoCodesAction,
  togglePromoCodeAction,
  upsertPromoCodeAction,
} from "./actions";

const EMPTY_FORM = {
  code: "",
  discount_percent: 10,
  active: true,
  expires_at: "",
};

function statusBadge(status) {
  if (status === "active") {
    return "bg-green-100 text-green-700";
  }

  if (status === "expired") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
}

export default function PromoPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  async function loadPromos() {
    try {
      const data = await getPromoCodesAction();
      setRows(data || []);
    } catch (error) {
      setMessage(error?.message || "Could not load promo codes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchPromos() {
      try {
        const data = await getPromoCodesAction();
        if (!ignore) {
          setRows(data || []);
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error?.message || "Could not load promo codes.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchPromos();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await upsertPromoCodeAction(form);
      setMessage("Promo code updated.");
      setForm(EMPTY_FORM);
      await loadPromos();
    } catch (error) {
      setMessage(error?.message || "Could not save promo code.");
    }
  }

  async function handleToggle(code, active) {
    try {
      await togglePromoCodeAction(code, !active);
      await loadPromos();
    } catch (error) {
      setMessage(error?.message || "Could not update promo code.");
    }
  }

  async function handleDelete(code) {
    try {
      await deletePromoCodeAction(code);
      await loadPromos();
    } catch (error) {
      setMessage(error?.message || "Could not delete promo code.");
    }
  }

  const enrichedRows = rows.map((row) => {
    const expiresAt = row.expires_at ? new Date(row.expires_at) : null;
    const now = new Date();
    let status = row.active ? "active" : "inactive";

    if (row.active && expiresAt && expiresAt < now) {
      status = "expired";
    }

    return { ...row, status };
  });

  if (loading) {
    return (
      <div className="w-full min-h-75 rounded-2xl border border-gray-200 bg-white p-4">
        <Spinner
          label="Loading promo codes"
          fullScreen={false}
          variant="inner-page"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-(--text) md:text-2xl">
        Promo Codes
      </h1>
      <p className="mt-1 text-xs text-gray-500">
        Create, activate, deactivate, and monitor promo offers.
      </p>

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-gray-200 bg-white p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Code
            <input
              value={form.code}
              onChange={(event) =>
                setForm((current) => ({ ...current, code: event.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm uppercase"
              placeholder="FREEDAY"
              required
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Discount Percentage
            <input
              type="number"
              min="1"
              max="100"
              value={form.discount_percent}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  discount_percent: Number(event.target.value || 0),
                }))
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Expiry date
            <input
              type="date"
              value={form.expires_at}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  expires_at: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
            />
            Active immediately
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-(--forest) px-4 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            Save promo code
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Value</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrichedRows.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-400" colSpan={5}>
                    No promo codes yet.
                  </td>
                </tr>
              )}

              {enrichedRows.map((row) => (
                <tr key={row.code} className="border-t border-gray-200">
                  <td className="p-3 font-semibold text-slate-800">
                    {row.code}
                  </td>
                  <td className="p-3">
                    {Number.isFinite(Number(row.discount_percent))
                      ? `${Number(row.discount_percent)}%`
                      : "0%"}
                  </td>
                  <td className="p-3">
                    {row.expires_at
                      ? new Date(row.expires_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusBadge(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(row.code, row.active)}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700"
                      >
                        {row.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.code)}
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

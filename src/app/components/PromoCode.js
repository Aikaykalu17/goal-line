"use client";

import { validatePromoCodeAction } from "@/app/(site)/booking/actions";
import { useState } from "react";
import SpinnerMini from "./SpinnerMini";
import formatCurrency from "@/utils/formatCurrency";

export default function PromoCodeInput({
  promoCode,
  discountApplied,
  dispatch,
  subtotal,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  async function applyPromoCode() {
    if (!promoCode?.trim()) return;

    setIsSearching(true);
    setError("");
    try {
      const result = await validatePromoCodeAction(promoCode, subtotal);
      if (result.valid) {
        dispatch({
          type: "SET_PROMO",
          code: promoCode.trim().toUpperCase(),
          discount: result.discount,
        });

        return;
      }

      dispatch({
        type: "SET_PROMO",
        code: promoCode.trim().toUpperCase(),
        discount: 0,
      });
      setError(result.reason || "Invalid or expired promo code");
    } catch (error) {
      dispatch({
        type: "SET_PROMO",
        code: promoCode.trim().toUpperCase(),
        discount: 0,
      });

      setError(error?.message || "Could not validate promo code.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="promoCode" className="sr-only">
          Promo Code
        </label>
        <input
          id="promoCode"
          type="text"
          placeholder="Promo Code"
          value={promoCode}
          onChange={(e) =>
            dispatch({
              type: "SET_USER",
              payload: { promoCode: e.target.value },
            })
          }
          className="border border-gray-400 rounded p-2 flex-1 text-xs"
          aria-invalid={!!error}
          aria-describedby={error ? "promo-error" : undefined}
        />

        <button
          type="button"
          onClick={applyPromoCode}
          disabled={isSearching}
          aria-busy={isSearching}
          className="flex items-center gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1 cursor-pointer disabled:opacity-60"
        >
          {isSearching ? (
            <>
              <SpinnerMini aria-hidden="true" />
              <span>Applying</span>
            </>
          ) : (
            <span>Apply</span>
          )}
        </button>
      </div>

      {discountApplied > 0 && (
        <p role="status" className="text-green-600 text-xs font-semibold">
          Promo code applied! You got a discount of ₦
          {formatCurrency(discountApplied)}
        </p>
      )}

      {error && (
        <p
          id="promo-error"
          role="alert"
          className="text-red-600 text-xs font-semibold"
        >
          {error}
        </p>
      )}
    </div>
  );
}

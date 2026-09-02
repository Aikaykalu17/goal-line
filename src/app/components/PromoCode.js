"use client";

import { validatePromoCodeAction } from "@/app/(site)/booking/actions";

export default function PromoCodeInput({
  promoCode,
  discountApplied,
  dispatch,
  subtotal,
}) {
  async function applyPromoCode() {
    if (!promoCode?.trim()) return;

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
      alert(result.reason || "Invalid or expired promo code");
    } catch (error) {
      dispatch({
        type: "SET_PROMO",
        code: promoCode.trim().toUpperCase(),
        discount: 0,
      });
      alert(error?.message || "Could not validate promo code.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
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
        />
        <button
          type="button"
          onClick={applyPromoCode}
          className=" flex items-center gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1 cursor-pointer"
        >
          Apply
        </button>
      </div>

      {discountApplied > 0 && (
        <p className="text-green-600 text-xs font-semibold">
          Promo code applied! You got a discount of ₦{discountApplied}
        </p>
      )}
    </div>
  );
}

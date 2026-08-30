"use client";

import { getActivePromo } from "../services/promoService";

export default function PromoCodeInput({
  promoCode,
  discountApplied,
  dispatch,
}) {
  async function applyPromoCode() {
    if (!promoCode) return;

    const promo = await getActivePromo(promoCode);

    if (promo) {
      dispatch({
        type: "SET_PROMO",
        code: promoCode,
        discount: promo.discount_percent,
      });
    } else {
      dispatch({
        type: "SET_PROMO",
        code: promoCode,
        discount: 0,
      });
      alert("Invalid or expired promo code");
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
          Promo applied! You saved ₦{discountApplied}
        </p>
      )}
    </div>
  );
}

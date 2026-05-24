import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "DGOT — Webshop & Coins" },
      { name: "description", content: "Buy DGOT coins to unlock premium, mounts, outfits and store items." },
    ],
  }),
  component: PaymentPage,
});

const packages = [
  { id: 193, coins: 250, price: "€ 4,90" },
  { id: 194, coins: 750, price: "€ 12,90", bonus: "+50 bonus" },
  { id: 195, coins: 1500, price: "€ 24,90", bonus: "+150 bonus" },
  { id: 196, coins: 3000, price: "€ 44,90", bonus: "+450 bonus" },
  { id: 197, coins: 6000, price: "€ 79,90", bonus: "+1200 bonus" },
  { id: 198, coins: 12000, price: "€ 149,90", bonus: "+3000 bonus", featured: true },
];

const methods = [
  { id: 31, label: "Pix", icon: "⚡" },
  { id: 32, label: "Credit Card", icon: "💳" },
  { id: 144, label: "PayPal", icon: "🅿" },
];

function PaymentPage() {
  const [selected, setSelected] = useState(195);
  const [method, setMethod] = useState(31);
  return (
    <ProtectedPage>
      <PageBox title="Webshop" icon="✦">
        <div className="banner-header mb-3 pixel-text text-[10px] text-center">Select Product</div>
        <Field label="Country">
          <select className={inputClass + " mb-5"}>
            <option>Brazil</option><option>United States</option><option>Germany</option><option>Portugal</option>
          </select>
        </Field>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <label
              key={p.id}
              className={
                "cursor-pointer rounded-sm border-2 p-4 text-center transition " +
                (selected === p.id
                  ? "border-[color:var(--gold-bright)] bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]"
                  : "border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] text-[color:var(--ink)] hover:bg-[color:var(--gold)]")
              }
            >
              <input type="radio" name="pkg" className="sr-only" checked={selected === p.id} onChange={() => setSelected(p.id)} />
              {p.featured && <div className="pixel-text mb-2 text-[8px] text-[color:var(--gold-bright)]">★ BEST VALUE</div>}
              <div className="pixel-text text-[14px]">{p.coins.toLocaleString("en-US")}</div>
              <div className="font-[VT323] text-lg">DGOT Coins</div>
              {p.bonus && <div className="font-[VT323] text-base opacity-80">{p.bonus}</div>}
              <div className="mt-2 pixel-text text-[10px]">{p.price}</div>
            </label>
          ))}
        </div>

        <div className="banner-header mb-3 pixel-text text-[10px] text-center">Payment Method</div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <label
              key={m.id}
              className={
                "flex cursor-pointer items-center gap-3 rounded-sm border-2 px-4 py-3 font-[VT323] text-lg " +
                (method === m.id
                  ? "border-[color:var(--gold-bright)] bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]"
                  : "border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)]")
              }
            >
              <input type="radio" name="method" className="sr-only" checked={method === m.id} onChange={() => setMethod(m.id)} />
              <span className="text-2xl">{m.icon}</span> {m.label}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg">
          <div>
            <strong>Order Summary:</strong>{" "}
            {packages.find((p) => p.id === selected)?.coins.toLocaleString("en-US")} coins —{" "}
            {packages.find((p) => p.id === selected)?.price}
          </div>
          <div className="flex gap-2">
            <Link to="/account" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">Cancel</Link>
            <button className="btn-gold pixel-text text-[10px]">✦ Buy Now</button>
          </div>
        </div>
      </PageBox>
    </ProtectedPage>
  );
}

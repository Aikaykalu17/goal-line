"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HamburgerList({ navItems, onClose }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-200 ${
                isActive ? "bg-(--primary)/20" : "hover:bg-(--white)/10"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-(--primary)" : "bg-(--white)/10"
                }`}
              >
                <item.icon
                  size={20}
                  color={isActive ? "white" : "var(--white)"}
                />
              </div>
              <span
                className={`text-[15px] font-semibold transition-colors ${
                  isActive ? "text-(--primary)" : "text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default HamburgerList;

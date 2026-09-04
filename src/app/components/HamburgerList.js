"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HamburgerList({ navItems, onClose }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-200 ${
                isActive ? "bg-(--primary)/20" : "hover:bg-(--white)/10"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  isActive ? "bg-(--primary)" : "bg-(--white)/10"
                }`}
              >
                <item.icon
                  size={16}
                  color={isActive ? "white" : "var(--white)"}
                />
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
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

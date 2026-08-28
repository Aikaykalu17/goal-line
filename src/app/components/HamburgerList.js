"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HamburgerList({ navItems, onClose }) {
  const pathname = usePathname();

  return (
    <ul className="min-h-min flex flex-col h-[80%] gap-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <li key={item.id} className="flex items-center gap-6">
            <item.icon size={25} color={"var(--white)"} />
            <Link
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-(--white) font-bold text-xs"
                  : "text-(--white) text-xs"
              }
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default HamburgerList;

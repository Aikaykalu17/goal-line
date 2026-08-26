"use client";

import { Info, Phone, HomeIcon, Calendar } from "lucide-react";

const navItems = [
  { id: 1, label: "Home", href: "/", icon: HomeIcon },
  { id: 2, label: "About GoalLine Turf", href: "/abou", icon: Info },
  { id: 3, label: "How It Works", href: "/booking", icon: Calendar },
  { id: 10, label: "Contact Us", href: "/contact", icon: Phone },
];

export default navItems;

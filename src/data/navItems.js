"use client";

import {
  Info,
  Phone,
  HomeIcon,
  Workflow,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";

const navItems = [
  { id: 1, label: "Home", href: "/", icon: HomeIcon },
  { id: 2, label: "About GoalLine Turf", href: "/abou", icon: Info },
  { id: 3, label: "How It Works", href: "/how-it-works", icon: Workflow },
  { id: 4, label: "Contact Us", href: "/contact", icon: Phone },
  { id: 5, label: "Booking Policy", href: "/booking-policy", icon: Calendar },
  { id: 6, label: "Terms & Conditions", href: "/terms", icon: Shield },
  { id: 7, label: "Privacy Policy", href: "/privacy", icon: FileText },
];

export default navItems;

import {
  FaDatabase,
  FaCogs,
  FaShareAlt,
  FaLock,
  FaUserShield,
} from "react-icons/fa";

const privacy = [
  {
    id: 1,
    title: "Information We Collect",
    description:
      "We collect personal information such as your name, email address, phone number and booking details.",
    icon: <FaDatabase size={50} color="var(--primary)" aria-hidden="true" />, // 👈 JSX element
  },
  {
    id: 2,
    title: "How We Use Your Information",
    description:
      "We use your information to process bookings, communicate with you, and improve our services.",
    icon: <FaCogs size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 3,
    title: "Information Sharing",
    description:
      "We do not share or sell your personal information with third parties except as required by law.",
    icon: <FaShareAlt size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 4,
    title: "Data Security",
    description:
      "We implement appropriate measures to protect your data from unauthorized access.",
    icon: <FaLock size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 5,
    title: "Your Rights",
    description:
      "You can request access to or deletion of your personal information at any time.",
    icon: <FaUserShield size={50} color="var(--primary)" aria-hidden="true" />,
  },
];

export default privacy;

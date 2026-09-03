import {
  FaCalendarAlt,
  FaClock,
  FaLock,
  FaTags,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";

const booking = [
  {
    id: 1,
    title: "Today’s availability",
    description:
      "The booking calendar shows the current day’s open playing window. Greyed-out dates or times tell you the turf is unavailable, while green indicates a time that is still open and ready to book.",
    icon: <FaCalendarAlt size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 2,
    title: "Private booking control",
    description:
      "A Team / Group booking can be set to Private booking. That means the selected time becomes unavailable to everyone else for the full slot, which is ideal for closed sessions, private matches, or internal club play.",
    icon: <FaLock size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 3,
    title: "Open-to-others bookings",
    description:
      "A Team / Group booking can also be set to Open to others. This keeps the slot visible for other players and follows the same logic as solo bookings, so it does not block other people from using that period.",
    icon: <FaUsers size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 4,
    title: "Notes that help us serve you better",
    description:
      "The Notes field is useful for telling us about your booking details, special requests, team preferences, or any relevant information that helps us prepare for your game and keep the experience smooth.",
    icon: <FaClock size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 5,
    title: "Promo savings and expiry",
    description:
      "Promo codes can reduce your total cost when valid. Each code has its own conditions, discount percentage, and expiry date, so the system checks the code as part of the booking before final confirmation.",
    icon: <FaTags size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 6,
    title: "Confirmed status and extra time",
    description:
      "Once payment is made, a booking becomes confirmed. If the players want to continue after the original window ends, extra minutes can be added to a confirmed ticket, allowing the game to continue without leaving the pitch too early.",
    icon: <FaCheckCircle size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 7,
    title: "Flexible pricing",
    description:
      "Pricing is managed centrally by the admin team and can be adjusted for nights, weekends, or special periods. This makes it possible to increase or reduce rates based on demand, schedule, or operational strategy.",
    icon: (
      <FaMoneyBillWave size={50} color="var(--primary)" aria-hidden="true" />
    ),
  },
];

export default booking;

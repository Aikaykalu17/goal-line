import {
  FaCalendarCheck, // Advance Booking
  FaCreditCard, // Payment
  FaTimesCircle, // Cancellation
  FaCalendarPlus, // Rescheduling
  FaUserTimes, // No Show Policy
} from "react-icons/fa";

const booking = [
  {
    id: 1,
    title: "Advance Booking",
    description:
      "All bookings must be made at least 1 hour in advance to ensure availability",
    icon: (
      <FaCalendarCheck size={50} color="var(--primary)" aria-hidden="true" />
    ),
  },
  {
    id: 2,
    title: "Payment",
    description:
      "Payment is made on arrival at the turf. We do not offer online payments at the moment.",
    icon: <FaCreditCard size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 3,
    title: "Cancellations",
    description:
      "Cancellations made less than 2 hours before your booking time will be charged 50% of the total fee.",
    icon: <FaTimesCircle size={50} color="var(--primary)" aria-hidden="true" />,
  },
  {
    id: 4,
    title: "Rescheduling",
    description:
      "You can reschedule your booking up to 3 hours before your booking time, subject to availability.",
    icon: (
      <FaCalendarPlus size={50} color="var(--primary)" aria-hidden="true" />
    ),
  },
  {
    id: 5,
    title: "No Show Policy",
    description: "No shows will be charged the full booking amount.",
    icon: <FaUserTimes size={50} color="var(--primary)" aria-hidden="true" />,
  },
];

export default booking;

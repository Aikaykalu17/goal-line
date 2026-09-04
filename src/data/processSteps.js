const processSteps = [
  {
    number: "1",
    title: "Choose your day and see the real availability",
    text: "Start by selecting the date you want to play. The system shows your day’s availability range, which is the time window the turf is open for bookings. The green range signals your own booking time, while the grey range means the turf has been booked by others who are willing to share. A date can be made unavailable for several reasons, including maintenance, a full-day booking by an organisation for a football event, or a private reservation that has already been locked in.",
  },
  {
    number: "2",
    title: "Select a start time and end time",
    text: "The start time and end time work together as a time range. For example, if a session starts at 5:00 PM and ends at 7:00 PM, that time range is reserved for the booking. The system only allows valid slot lengths in 30-minute steps, so your session is measured precisely to prevent overlap and confusion. Once you select a start time, the end time options are filtered so they stay within real available periods and avoid conflicting bookings.",
  },
  {
    number: "3",
    title: "Pick the right booking type",
    text: "Choose whether you are booking as a Solo / Individual or as a Team / Group. If it is a Team / Group booking, you can decide between Private booking and Open to others. Private booking blocks the selected time entirely and makes it unavailable to everyone else. Open to others keeps the slot available for anyone else who wants to join in, similar to a solo booking. This helps you choose the level of exclusivity you want while keeping the turf fair and flexible.",
  },
  {
    number: "4",
    title: "Add the number of players and any useful notes",
    text: "The player count helps the system understand the kind of session you are creating. It also matters for how the turf is managed, especially when the booking is a group session. The Notes section is important because it lets you tell us if you are bringing a large group, want a certain pitch setup, need a private session, or have any special instruction that helps us prepare before your arrival.",
  },
  {
    number: "5",
    title: "Review the price, apply a promo code, and confirm",
    text: "Before the booking is finalised, you will see the amount due, the discount if a valid promo code is used, and the final total. Promo codes are checked against their validity and expiry date. If the code is active and not expired, the discount is applied automatically. Once you confirm the booking, it moves into a pending state until payment is made and the booking is accepted as confirmed.",
  },
  {
    number: "6",
    title: "Pending becomes confirmed only after payment is made",
    text: "A booking can exist in pending status while it is waiting for confirmation. Once payment is made, the status changes to confirmed. This is the point at which the booking is officially locked in and ready to be managed. If a booking is made in the past and it was never confirmed, it can expire automatically, which means it is no longer considered valid and the time becomes available again for future use.",
  },
  {
    number: "7",
    title: "Extra time can be added after confirmation",
    text: "Add more minutes or hours to your booking and keep playing. Extra time is paid by you or your group",
  },
];

export default processSteps;

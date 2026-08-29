"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { differenceInHours, parse } from "date-fns";

export default function SelectTime({
  selectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  if (!selectedDate) return null;

  const timeOptions = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const endOptions = startTime
    ? timeOptions.slice(timeOptions.indexOf(startTime) + 1)
    : timeOptions;

  // ✅ Duration calculation
  let duration = null;
  if (startTime && endTime) {
    const start = parse(startTime, "hh:mm a", selectedDate);
    const end = parse(endTime, "hh:mm a", selectedDate);
    const diff = differenceInHours(end, start);
    if (diff > 0) duration = diff;
  }

  const StyledItem = ({ value }) => (
    <Select.Item
      value={value}
      className={`
        flex items-center justify-between p-2 cursor-pointer rounded
        hover:bg-(--primary)/10
        data-[state=checked]:bg-(--primary-dark)
        data-[state=checked]:text-white
        data-[state=checked]:font-semibold
      `}
    >
      <Select.ItemText>{value}</Select.ItemText>
      <Select.ItemIndicator>
        <CheckIcon className="text-white" />
      </Select.ItemIndicator>
    </Select.Item>
  );

  return (
    <div className="mt-6 w-full max-w-sm rounded-xl border border-(--border) bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-(--text)">
        Selected Date: {selectedDate.toDateString()}
      </p>

      {/* Start Time */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-(--text)">
          Start Time
        </label>
        <Select.Root value={startTime} onValueChange={setStartTime}>
          <Select.Trigger className="mt-1 flex items-center justify-between border rounded p-2 w-full text-(--text)">
            <Select.Value placeholder="Select start time" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white border rounded shadow">
              <Select.Viewport>
                {timeOptions.map((time) => (
                  <StyledItem key={time} value={time} />
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* End Time */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-(--text)">
          End Time
        </label>
        <Select.Root value={endTime} onValueChange={setEndTime}>
          <Select.Trigger className="mt-1 flex items-center justify-between border rounded p-2 w-full text-(--text)">
            <Select.Value placeholder="Select end time" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white border rounded shadow">
              <Select.Viewport>
                {endOptions.map((time) => (
                  <StyledItem key={time} value={time} />
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* ✅ Show Duration immediately */}
      {duration && (
        <p className="text-sm font-semibold text-(--text)">
          Duration: {duration} {duration === 1 ? "hour" : "hours"}
        </p>
      )}
    </div>
  );
}

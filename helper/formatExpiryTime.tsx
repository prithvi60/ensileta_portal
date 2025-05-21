import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatExpiryTime(expiresAt: string): string {
    // Parse the UTC timestamp
    const utcDate = parseISO(expiresAt);

    // Convert to Asia/Kolkata timezone (GMT +05:30)
    const istDate = toZonedTime(utcDate, "Asia/Kolkata");

    // Format as "Month Day, Year Hour:Minute AM/PM"
    return format(istDate, "MMMM d, yyyy h:mm a");
}
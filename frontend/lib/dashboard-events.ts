import { EVENT_CATEGORIES } from "@/lib/events";

export const ALL_EVENT_NAMES = EVENT_CATEGORIES.flatMap((category) =>
  category.events.map((eventName) => ({
    name: eventName,
    category: category.category,
  }))
);

export function getEventCategoryByName(eventName: string): string {
  const found = ALL_EVENT_NAMES.find((item) => item.name.toLowerCase() === eventName.toLowerCase());
  return found?.category || "General";
}

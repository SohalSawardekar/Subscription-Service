import Subscription from "../models/subscriptionModel.js";
import dayjs from "dayjs";

/* eslint-disable no-undef */
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1]; // Days before renewal

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    console.log("No active subscription found. Skipping reminders.");
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  if (renewalDate.isBefore(dayjs())) {
    console.log("Renewal date has passed. Skipping reminders.");
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore}`, reminderDate);
    }
  }

  // Send the reminder AFTER all delays have been handled
  for (const daysBefore of REMINDERS) {
    await triggerReminder(context, `Reminder ${daysBefore}`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  try {
    return await context.run("get subscription", () => {
      return Subscription.findById(subscriptionId).populate(
        "user",
        "name email"
      );
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Scheduling ${label} for ${date.format("YYYY-MM-DD HH:mm:ss")}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering reminder: ${label}`);
  });
};

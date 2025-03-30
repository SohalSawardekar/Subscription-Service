import { SERVER_URL } from "../config/env.js";
import workflowClient from "../config/upstash.js";
import Subscription from "../models/subscriptionModel.js";

/**
 * @desc    Create a new subscription
 * @route   POST /api/subscriptions
 * @access  Protected (User)
 */
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      user: req.user._id,
      ...req.body,
    });

    // Trigger reminder workflow with subscription ID
    // await workflowClient.trigger({
    //   url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
    //   method: "POST",
    //   body: JSON.stringify({ subscriptionId: subscription._id }),
    //   headers: { "Content-Type": "application/json" },
    // });

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all subscriptions (Admin access)
 * @route   GET /api/subscriptions
 * @access  Protected (Admin)
 */
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate(
      "user",
      "name email"
    );

    if (!subscriptions.length) {
      return res.status(404).json({
        success: false,
        message: "No subscriptions found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific user's subscriptions
 * @route   GET /api/subscriptions/user/:id
 * @access  Protected (User)
 */
export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get subscription details by ID
 * @route   GET /api/subscriptions/:id
 * @access  Protected (User/Admin)
 */
export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription details retrieved",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a subscription
 * @route   PUT /api/subscriptions/:id
 * @access  Protected (User/Admin)
 */
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (req.user.id !== subscription.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this subscription",
      });
    }

    Object.assign(subscription, req.body);
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a subscription
 * @route   DELETE /api/subscriptions/:id
 * @access  Protected (User/Admin)
 */
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (req.user.id !== subscription.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this subscription",
      });
    }

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a subscription
 * @route   PUT /api/subscriptions/:id/cancel
 * @access  Protected (User/Admin)
 */
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (req.user.id !== subscription.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this subscription",
      });
    }

    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get upcoming renewals
 * @route   GET /api/subscriptions/upcoming-renewals
 * @access  Protected (Admin)
 */
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const upcomingRenewals = await Subscription.find({
      renewalDate: { $gte: today },
      status: "active",
    });

    res.status(200).json({
      success: true,
      message: "Upcoming renewals retrieved successfully",
      data: upcomingRenewals,
    });
  } catch (error) {
    next(error);
  }
};

import Reservation from "../models/Reservation.js";
import moment from "moment";
import "moment-timezone";
import Stripe from "stripe";

export const stripePayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);

  console.log(req.body.reservations);

  const line_items = req.body.reservations.map((reservation) => {
    return {
      price_data: {
        currency: "egp",
        product_data: {
          name: reservation.hotelName,
          images: reservation.roomImages,
        },
        unit_amount: reservation.cost * 100,
      },
      quantity: 1,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/#/checkoutSuccess`,
    cancel_url: `${process.env.CLIENT_URL}/#/checkoutFailed`,
  });

  res.send({ url: session.url });
};

export const createReservation = async (req, res, next) => {
  const startDate = moment.tz(req.body.reservationDuration.startDate, "UTC");
  const endDate = moment.tz(req.body.reservationDuration.endDate, "UTC");

  const newReservation = new Reservation({
    ...req.body,
    reservationDuration: {
      startDate,
      endDate,
    },
  });
  try {
    const savedReservation = await newReservation.save();
    res.status(200).json(savedReservation);
  } catch (error) {
    next(error);
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body.reservationDuration;

    // Convert the incoming dates to UTC with time zone offset set to +0 GMT
    const utcStartDate = moment(startDate).utcOffset(0).toDate();
    const utcEndDate = moment(endDate).utcOffset(0).toDate();

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "reservationDuration.startDate": utcStartDate,
          "reservationDuration.endDate": utcEndDate,
        },
      },
      { new: true }
    );
    console.log(updatedReservation);
    res.status(200).json(updatedReservation);
  } catch (error) {
    next(error);
  }
};

export const getUserReservations = async (req, res, next) => {
  try {
    const reservation = await Reservation.find({
      userId: req.params.id,
    }).exec();
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json("Reservation Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation)
      res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (req, res, next) => {
  try {
    const allReservations = await Reservation.find();
    res.status(200).json(allReservations);
  } catch (error) {
    next(error);
  }
};

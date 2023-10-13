import Hotel from "../models/Hotel.js";
import HotelRate from "../models/HotelRate.js";

export const createRate = async (req, res, next) => {
  const userId = req.params.userId;
  const hotelId = req.params.hotelId;
  const rateObj = {
    hotelId,
    userId,
    rating: req.body.rating,
  };
  let updatedRate, savedRate;

  const newRate = new HotelRate(rateObj);
  console.log(req.params.userId);
  try {
    const query = {
      userId: userId,
      hotelId: hotelId,
    };

    const existingRate = await HotelRate.findOne(query);

    if (existingRate) {
      const update = {
        $set: {
          rating: req.body.rating,
        },
      };

      updatedRate = await HotelRate.findOneAndUpdate(query, update, {
        new: true,
      });

      if (updatedRate) {
        console.log("Found and updated document:", updatedRate);
        //res.status(200).json(updatedRate);
      } else {
        //res.status(500).json({ success: false, message: "Update failed" });
      }
    } else {
      savedRate = await newRate.save();
      //res.status(200).json(savedRate);
    }

    console.log("hotelId:", hotelId);
    const allRates = await HotelRate.find({ hotelId: hotelId });
    console.log("allRates:", allRates);

    let totalRates = 0;
    allRates.map((HotelRate) => {
      totalRates = totalRates + HotelRate.rating;
    });

    console.log("total Rates:", totalRates);
    const rate = totalRates % 5;
    console.log("rate = totalRates % 5:", rate);

    await Hotel.findByIdAndUpdate(
      hotelId,
      { $set: { rating: rate } },
      { new: true }
    );

    if (updatedRate) res.status(200).json(updatedRate);
    else res.status(200).json(savedRate);
  } catch (error) {
    next(error);
  }
};

export const updateRate = async (req, res, next) => {
  try {
    const updatedRate = await HotelRate.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getRate = async (req, res, next) => {
  try {
    const existedRate = await HotelRate.findById(req.params.id);
    res.status(200).json(existedRate);
  } catch (error) {
    next(error);
  }
};

export const getAllRates = async (req, res, next) => {
  try {
    const allRates = await HotelRate.find();
    res.status(200).json(allRates);
  } catch (error) {
    next(error);
  }
};

export const deleteRate = async (req, res, next) => {
  try {
    await Rate.findByIdAndDelete(req.params.id);
  } catch (error) {
    next(error);
  }
};

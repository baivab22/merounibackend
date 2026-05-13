import {
  COUNTRIES,
  NEPAL_DISTRICTS,
  NEPAL_CITIES,
} from "../../constants/location.js";

class MiscController {
  async getCountryList(req, res) {
    try {
      res.status(200).json({ success: true, data: COUNTRIES });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getNepalDistrictList(req, res) {
    try {
      res.status(200).json({ success: true, data: NEPAL_DISTRICTS });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getNepalCityList(req, res) {
    try {
      res.status(200).json({ success: true, data: NEPAL_CITIES });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default new MiscController();

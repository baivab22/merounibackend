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
      const { q } = req.query;
      let districts = NEPAL_DISTRICTS;
      if (q) {
        const search = q.toLowerCase();
        districts = NEPAL_DISTRICTS.filter((d) =>
          d.toLowerCase().includes(search)
        );
      }
      res.status(200).json({ success: true, data: districts });
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

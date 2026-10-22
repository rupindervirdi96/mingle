// Reads optional settings that may be absent from the JSON config files.
const config = require("config");

const get = (key, fallback) => (config.has(key) ? config.get(key) : fallback);

module.exports = {
  smtp: {
    service: get("smtp.service", "Gmail"),
    user: get("smtp.user", ""),
    pass: get("smtp.pass", ""),
  },
  cloudinary: {
    cloudName: get("cloudinary.cloudName", "dinspdp3w"),
    uploadPreset: get("cloudinary.uploadPreset", "dyzi4adq"),
  },
  emailVerificationEnabled() {
    return Boolean(this.smtp.user && this.smtp.pass);
  },
};

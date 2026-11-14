import { Op } from "sequelize";
import MembershipOption from "../../models/student-membership/MembershipOption.model.js";

export const MEMBERSHIP_OPTION_TYPES = ["LEVEL", "CAREER_FIELD", "PAYMENT_METHOD"];

const parseMetadata = (metadata) => {
  if (!metadata) return {};
  if (typeof metadata === "object") return metadata;
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
};

const normalizeOption = (option) => {
  const plain = option.get ? option.get({ plain: true }) : option;
  return {
    ...plain,
    metadata: parseMetadata(plain.metadata),
  };
};

const serializeMetadata = (metadata) => {
  if (metadata === undefined || metadata === null || metadata === "") return null;
  if (typeof metadata === "string") {
    JSON.parse(metadata);
    return metadata;
  }
  return JSON.stringify(metadata);
};

const PAYMENT_METADATA_TEXT_FIELDS = [
  "qr_code_url",
  "account_name",
  "account_number",
  "bank_name",
  "branch_name",
  "account_instructions",
  "account_details",
];

// Older payment methods may have been saved with slightly different keys.
// Normalise those to the canonical shape the member form understands.
const PAYMENT_METADATA_ALIASES = {
  qr_code_url: ["qr_code", "qr_url"],
  account_name: ["account_holder_name", "account_holder"],
  account_number: ["account_no", "account"],
  bank_name: ["bank", "wallet_name"],
  account_details: ["bank_details"],
};

// Payment methods can be created through the dashboard or directly through the
// API. Keep the stored shape predictable: trim values and derive the display
// mode when the caller did not provide a valid one, so the member form always
// knows whether to render a QR code, bank details, or both.
const normalizePaymentMetadata = (metadata) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return metadata;
  }

  const next = { ...metadata };

  Object.entries(PAYMENT_METADATA_ALIASES).forEach(([canonical, aliases]) => {
    if (next[canonical]) return;
    const alias = aliases.find((key) => next[key]);
    if (alias) next[canonical] = next[alias];
  });

  PAYMENT_METADATA_TEXT_FIELDS.forEach((key) => {
    if (typeof next[key] === "string") {
      const trimmed = next[key].trim();
      if (trimmed) next[key] = trimmed;
      else delete next[key];
    }
  });

  const hasQr = Boolean(next.qr_code_url);
  const hasAccount = Boolean(
    next.account_name ||
      next.account_number ||
      next.bank_name ||
      next.branch_name ||
      next.account_instructions ||
      next.account_details
  );

  if (!["QR", "ACCOUNT", "BOTH"].includes(next.payment_mode)) {
    next.payment_mode = hasQr && hasAccount
      ? "BOTH"
      : hasQr
        ? "QR"
        : hasAccount
          ? "ACCOUNT"
          : "BOTH";
  }

  return next;
};

const prepareMetadata = (type, metadata) => {
  if (metadata === undefined) return undefined;
  if (type !== "PAYMENT_METHOD") return metadata;

  const parsed = typeof metadata === "string" ? parseMetadata(metadata) : metadata;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return metadata;
  }

  return normalizePaymentMetadata(parsed);
};

class MembershipOptionService {
  async getGroupedOptions({ admin = false } = {}) {
    const where = admin ? {} : { is_active: true };
    const options = await MembershipOption.findAll({
      where,
      order: [
        ["type", "ASC"],
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });

    const grouped = {
      levels: [],
      career_fields: [],
      payment_methods: [],
    };

    options.map(normalizeOption).forEach((option) => {
      if (option.type === "LEVEL") grouped.levels.push(option);
      if (option.type === "CAREER_FIELD") grouped.career_fields.push(option);
      if (option.type === "PAYMENT_METHOD") grouped.payment_methods.push(option);
    });

    return grouped;
  }

  async listOptions(query = {}) {
    const where = {};
    if (query.type) where.type = query.type;
    if (query.is_active !== undefined) {
      where.is_active = query.is_active === true || query.is_active === "true";
    }
    if (query.q) {
      const term = query.q.trim();
      where[Op.or] = [
        { label: { [Op.like]: `%${term}%` } },
        { slug: { [Op.like]: `%${term}%` } },
      ];
    }

    const options = await MembershipOption.findAll({
      where,
      order: [
        ["type", "ASC"],
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });

    return options.map(normalizeOption);
  }

  async createOption(payload) {
    const option = await MembershipOption.create({
      type: payload.type,
      slug: payload.slug,
      label: payload.label,
      description: payload.description || null,
      metadata: serializeMetadata(
        prepareMetadata(payload.type, payload.metadata)
      ),
      sort_order: payload.sort_order ?? 0,
      is_active: payload.is_active ?? true,
    });

    return normalizeOption(option);
  }

  async updateOption(id, payload) {
    const option = await MembershipOption.findByPk(id);
    if (!option) {
      const error = new Error("Membership option not found");
      error.status = 404;
      throw error;
    }

    ["type", "slug", "label", "description", "sort_order", "is_active"].forEach(
      (key) => {
        if (payload[key] !== undefined) option[key] = payload[key];
      }
    );

    if (payload.metadata !== undefined) {
      option.metadata = serializeMetadata(
        prepareMetadata(payload.type ?? option.type, payload.metadata)
      );
    }

    await option.save();
    return normalizeOption(option);
  }

  async deleteOption(id) {
    const deleted = await MembershipOption.destroy({ where: { id } });
    if (!deleted) {
      const error = new Error("Membership option not found");
      error.status = 404;
      throw error;
    }
    return { message: "Membership option deleted successfully" };
  }
}

export default MembershipOptionService;

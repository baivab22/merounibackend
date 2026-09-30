import StudentMembership from "../../models/student-membership/StudentMembership.model.js";
import UserModel from "../../models/users/User.model.js";
import {
  MEMBERSHIP_TYPES,
  MEMBERSHIP_STATUSES,
  REFERENCE_PATTERN,
} from "../../validators/student-membership/StudentMembership.validator.js";
import { sendMembershipApprovedEmail } from "../../utils/MembershipMail.util.js";
import crypto from "crypto";
import { Op } from "sequelize";

// Normalises the selected trainings list before persisting it as JSON text.
// De-duplicates while preserving the order the member picked them in.
const serializeTrainings = (trainings) => {
  if (!Array.isArray(trainings)) return null;
  const cleaned = [
    ...new Set(trainings.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean)),
  ];
  return cleaned.length ? JSON.stringify(cleaned) : null;
};

// Ambiguous glyphs (0/O, 1/I) are dropped so a reference read aloud over the
// phone by a member paying at a bank counter can be transcribed correctly.
const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const REFERENCE_BODY_LENGTH = 8;
const REFERENCE_MAX_ATTEMPTS = 5;

const buildReferenceBody = () => {
  const bytes = crypto.randomBytes(REFERENCE_BODY_LENGTH);
  let out = "";
  for (let i = 0; i < REFERENCE_BODY_LENGTH; i += 1) {
    out += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length];
  }
  return out;
};

const isReferenceTaken = async (referenceId) => {
  const existing = await StudentMembership.findOne({
    where: { reference_id: referenceId },
    attributes: ["id"],
  });
  return Boolean(existing);
};

// Generates a unique payment reference, e.g. "MU-26-7F3K9QX2". The year prefix
// keeps references recognisable per cohort and the random body keeps them
// unguessable, so a reference cannot be used to probe for other members.
const generateReferenceId = async () => {
  const year = String(new Date().getFullYear()).slice(-2);

  for (let attempt = 0; attempt < REFERENCE_MAX_ATTEMPTS; attempt += 1) {
    const referenceId = `MU-${year}-${buildReferenceBody()}`;
    if (!(await isReferenceTaken(referenceId))) return referenceId;
  }

  // The unique index is the real guarantee; fall back to a db-derived value
  // rather than looping forever under pathological contention.
  const error = new Error("Could not generate a unique payment reference");
  error.status = 503;
  throw error;
};

// The member picks a payment method before the application row exists, so the
// browser generates the reference and sends it with the form. We honour it when
// it is well-formed and still free, and otherwise fall back to generating one
// here so API clients that omit it keep working.
const resolveReferenceId = async (clientReference) => {
  const candidate =
    typeof clientReference === "string" ? clientReference.trim().toUpperCase() : "";

  if (REFERENCE_PATTERN.test(candidate)) {
    if (!(await isReferenceTaken(candidate))) return candidate;

    const error = new Error(
      "This payment reference is already in use. Please reload the page and try again."
    );
    error.status = 409;
    throw error;
  }

  return generateReferenceId();
};

class StudentMembershipService {
  async applyForMembership(studentId, payload) {
    const student = await UserModel.findByPk(studentId);
    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }

    // Prevent duplicate pending/active application for the same plan
    const existing = await StudentMembership.findOne({
      where: {
        student_id: studentId,
        membership_type: payload.membership_type,
        status: { [Op.in]: ["PENDING", "APPROVED"] },
      },
    });

    if (existing) {
      const error = new Error(
        `You already have a ${existing.status.toLowerCase()} membership request for this plan`
      );
      error.status = 400;
      throw error;
    }

    const membership = await StudentMembership.create({
      student_id: studentId,
      reference_id: await resolveReferenceId(payload.reference_id),
      student_name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
      student_email: student.email || null,
      student_phone_no: student.phoneNo || null,
      membership_type: payload.membership_type,
      status: "PENDING",
      institution: payload.institution || null,
      career_field: payload.career_field || null,
      selected_trainings: serializeTrainings(payload.selected_trainings),
      payment_method: payload.payment_method || null,
      membership_fee: payload.membership_fee || null,
      payment_proof_url: payload.payment_proof_url || null,
      remarks: payload.remarks || null,
    });

    return membership;
  }

  async applyForMembershipAsGuest(payload) {
    const membership = await StudentMembership.create({
      reference_id: await resolveReferenceId(payload.reference_id),
      student_name: payload.student_name,
      student_email: payload.student_email,
      student_phone_no: payload.student_phone_no,
      membership_type: payload.membership_type,
      status: "PENDING",
      institution: payload.institution || null,
      career_field: payload.career_field || null,
      selected_trainings: serializeTrainings(payload.selected_trainings),
      payment_method: payload.payment_method || null,
      membership_fee: payload.membership_fee || null,
      payment_proof_url: payload.payment_proof_url || null,
      remarks: payload.remarks || null,
    });

    return membership;
  }

  async getStudentMemberships(studentId, query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereCondition = { student_id: studentId };

    if (query.status) {
      whereCondition.status = query.status;
    }

    const { count, rows } = await StudentMembership.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      memberships: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    };
  }

  async getAllMemberships(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (query.status) {
      whereCondition.status = query.status;
    }

    if (query.membershipType) {
      whereCondition.membership_type = query.membershipType;
    }

    if (query.studentId) {
      whereCondition.student_id = query.studentId;
    }

    if (query.q) {
      const term = query.q.trim();
      whereCondition[Op.or] = [
        { student_name: { [Op.like]: `%${term}%` } },
        { student_email: { [Op.like]: `%${term}%` } },
        { student_phone_no: { [Op.like]: `%${term}%` } },
        // Admins look applications up by the reference the member quoted in their
        // payment. A substring match already covers the full reference, the bare
        // body ("7F3K9QX2") and any partial, and the column's case-insensitive
        // collation makes the lookup case-insensitive too.
        { reference_id: { [Op.like]: `%${term}%` } },
      ];
    }

    const { count, rows } = await StudentMembership.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: UserModel,
          as: "student",
          attributes: [
            "id",
            "firstName",
            "middleName",
            "lastName",
            "email",
            "phoneNo",
            "educationLevel",
            "furtherEducationPlan",
          ],
          required: false,
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      memberships: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
        totalCount: count,
      },
    };
  }

  async getMembershipById(membershipId) {
    const membership = await StudentMembership.findByPk(membershipId, {
      include: [
        {
          model: UserModel,
          as: "student",
          attributes: [
            "id",
            "firstName",
            "middleName",
            "lastName",
            "email",
            "phoneNo",
            "educationLevel",
            "furtherEducationPlan",
          ],
          required: false,
        },
      ],
    });

    if (!membership) {
      const error = new Error("Membership not found");
      error.status = 404;
      throw error;
    }

    return membership;
  }

  async updateMembership(membershipId, payload) {
    const membership = await StudentMembership.findByPk(membershipId);
    if (!membership) {
      const error = new Error("Membership not found");
      error.status = 404;
      throw error;
    }

    if (payload.membership_type) {
      if (!MEMBERSHIP_TYPES.includes(payload.membership_type)) {
        const error = new Error("Invalid membership type");
        error.status = 400;
        throw error;
      }
      membership.membership_type = payload.membership_type;
    }

    if (payload.payment_proof_url !== undefined) {
      membership.payment_proof_url = payload.payment_proof_url;
    }

    await membership.save();
    return membership;
  }

  async updateMembershipStatus(membershipId, status, startDate = null, endDate = null, remarks = null) {
    const membership = await StudentMembership.findByPk(membershipId, {
      include: [
        {
          model: UserModel,
          as: "student",
          attributes: ["id", "email"],
          required: false,
        },
      ],
    });
    if (!membership) {
      const error = new Error("Membership not found");
      error.status = 404;
      throw error;
    }

    if (!MEMBERSHIP_STATUSES.includes(status)) {
      const error = new Error("Invalid status");
      error.status = 400;
      throw error;
    }

    const wasApproved = membership.status === "APPROVED";

    membership.status = status;

    if (status === "APPROVED") {
      if (startDate) {
        membership.start_date = new Date(startDate);
      }
      if (endDate) {
        membership.end_date = new Date(endDate);
      }
      if (!membership.start_date) {
        membership.start_date = new Date();
      }
    }

    if (remarks !== null && remarks !== undefined) {
      membership.remarks = remarks;
    }

    await membership.save();

    // This transition means the admin matched the member's offline payment
    // against their reference, so notify them. Mail failures must not undo a
    // verified payment — log and move on.
    if (status === "APPROVED" && !wasApproved) {
      try {
        await sendMembershipApprovedEmail(membership);
      } catch (mailError) {
        console.error(
          `[MembershipMail] Approval email failed for ${membership.reference_id}:`,
          mailError.message
        );
      }
    }

    return membership;
  }

  async deleteMembership(membershipId) {
    const membership = await StudentMembership.findByPk(membershipId);
    if (!membership) {
      const error = new Error("Membership not found");
      error.status = 404;
      throw error;
    }

    await membership.destroy();
    return { message: "Membership deleted successfully" };
  }
}

export default StudentMembershipService;
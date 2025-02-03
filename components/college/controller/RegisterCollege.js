import slug from "slug";

import { sequelize } from "../../../config/database.js";
import College from "../models/CollegeModel.js";
import CollegeAddress from "../models/CollegeAddress.js";
import CollegeContact from "../models/CollegeContact.js";
import CollegeCourse from "../models/CollegeCourse.js";
import CollegeMember from "../models/CollegeMember.js";
import CollegeAdmission from "../models/CollegeAdmission.js";

export const createOrUpdateCollege = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction

  try {
    const {
      id, // If present, update the college; otherwise, create a new one
      name,
      institute_type,
      author_id,
      university_id,
      google_map_url,
      address, // { country, state, city, street, postal_code }
      contacts, // Array of contact numbers
      courses, // Array of course IDs
      members, // Array of members [{name, contact_number, role, description}]
      admissions, // Array of admissions [{course_id, eligibility_criteria, admission_process, fee_details}]
    } = req.body;

    console.log(req.body);

    let collegeId = id;
    let slugs = slug(name);

    console.log(`Slug is: ${slugs}`)

    if (!collegeId) {
      // CREATE NEW COLLEGE
      const newCollege = await College.create(
        {
          name,
          slugs,
          institute_type,
          author_id,
          university_id,
          google_map_url,
        },
        { transaction: t }
      );
      collegeId = newCollege.id;
    } else {
      // UPDATE EXISTING COLLEGE
      await College.update(
        {
          name,
          slugs,
          institute_type,
          author_id,
          university_id,
          google_map_url,
        },
        { where: { id: collegeId }, transaction: t }
      );
    }

    // **UPDATE OR CREATE ADDRESS**
    if (address) {
      await CollegeAddress.upsert(
        { college_id: collegeId, ...address },
        { transaction: t }
      );
    }

    // **UPDATE OR CREATE CONTACTS**
    if (contacts && contacts.length > 0) {
      // Delete old contacts
      await CollegeContact.destroy({
        where: { college_id: collegeId },
        transaction: t,
      });

      // Insert new contacts
      const contactRecords = contacts.map((contact) => ({
        college_id: collegeId,
        contact_number: contact,
      }));
      await CollegeContact.bulkCreate(contactRecords, { transaction: t });
    }

    // **UPDATE OR CREATE COURSES**
    if (courses && courses.length > 0) {
      await CollegeCourse.destroy({
        where: { college_id: collegeId },
        transaction: t,
      });

      const courseRecords = courses.map((courseId) => ({
        college_id: collegeId,
        course_id: courseId,
      }));
      await CollegeCourse.bulkCreate(courseRecords, { transaction: t });
    }

    // **UPDATE OR CREATE MEMBERS**
    if (members && members.length > 0) {
      await CollegeMember.destroy({
        where: { college_id: collegeId },
        transaction: t,
      });

      const memberRecords = members.map((member) => ({
        college_id: collegeId,
        name: member.name,
        contact_number: member.contact_number,
        role: member.role,
        description: member.description,
      }));
      await CollegeMember.bulkCreate(memberRecords, { transaction: t });
    }

    // **UPDATE OR CREATE ADMISSIONS**
    if (admissions && admissions.length > 0) {
      await CollegeAdmission.destroy({
        where: { college_id: collegeId },
        transaction: t,
      });

      const admissionRecords = admissions.map((admission) => ({
        college_id: collegeId,
        course_id: admission.course_id,
        eligibility_criteria: admission.eligibility_criteria,
        admission_process: admission.admission_process,
        fee_details: admission.fee_details,
      }));
      await CollegeAdmission.bulkCreate(admissionRecords, { transaction: t });
    }

    await t.commit(); // Commit transaction

    res.status(200).json({
      message: collegeId
        ? "College updated successfully!"
        : "College created successfully!",
      collegeId,
    });
  } catch (error) {
    await t.rollback(); // Rollback on error
    res.status(500).json({ error: error.message });
  }
};

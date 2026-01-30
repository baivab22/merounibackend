import { Op, Sequelize } from "sequelize";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import CollegeCourse from "../../models/college/CollegeCourse.model.js";
import CollegeMember from "../../models/college/CollegeMember.model.js";
import CollegeAdmission from "../../models/college/CollegeAdmission.model.js";
import CollegeGallery from "../../models/college/CollegeGallery.model.js";
import CollegeFacility from "../../models/college/CollegeFacility.model.js";
import { University } from "../../models/university/University.model.js";
import Program from "../../models/program/Program.model.js";
import UserModel from "../../models/users/User.model.js";

class SchoolService {
    async listSchools(query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const sort = (query.sort || "asc").toUpperCase();
        const search = query.q || "";
        const isFeatured = query.is_featured;
        const pinned = query.pinned;

        const country = query.country || "";
        const state = query.state || "";
        const city = query.city || "";
        const district = query.district || "";
        const type = query.type || "";
        const amenity = query.amenity || "";
        const university = query.university || "";
        const programId = query.program_id ? parseInt(query.program_id, 10) : null;

        const offset = (page - 1) * limit;

        const whereCondition = {
            [Op.and]: [
                Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
            ],
        };

        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%` };
        }

        if (isFeatured !== undefined) {
            whereCondition.is_featured = isFeatured === "true" ? 1 : 0;
        }

        if (pinned !== undefined) {
            whereCondition.pinned = pinned === "true" ? 1 : 0;
        }

        if (type) {
            whereCondition.institute_type = type;
        }

        const addressCondition = {};
        if (country) {
            addressCondition.country = { [Op.like]: `%${country}%` };
        }
        if (state) {
            addressCondition.state = { [Op.like]: `%${state}%` };
        }
        if (city) {
            addressCondition.city = { [Op.like]: `%${city}%` };
        }
        if (district) {
            addressCondition.city = { [Op.like]: `%${district}%` };
        }

        const include = [
            {
                model: CollegeAddress,
                as: "address",
                attributes: ["country", "state", "city"],
                where: Object.keys(addressCondition).length ? addressCondition : undefined,
            },
        ];

        if (amenity) {
            include.push({
                model: CollegeFacility,
                as: "facilities",
                attributes: [],
                where: {
                    title: { [Op.like]: `%${amenity}%` },
                },
                required: true,
            });
        }

        if (university) {
            include.push({
                model: University,
                as: "university",
                attributes: ["fullname", "slugs"],
                where: {
                    [Op.or]: [
                        { slugs: { [Op.like]: `%${university}%` } },
                        { fullname: { [Op.like]: `%${university}%` } },
                    ],
                },
                required: true,
            });
        } else {
            include.push({
                model: University,
                as: "university",
                attributes: ["fullname", "slugs"],
            });
        }

        include.push({
            model: CollegeGallery,
            as: "collegeGallery",
        });

        const { count: totalCount, rows: items } = await College.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            distinct: true,
            order: [
                ["order_no_for_website", "ASC"],
                ["id", sort],
            ],
            include,
        });

        const collegeIds = items.map((college) => college.id);

        const usersWithCollegeId = await UserModel.findAll({
            where: {
                collegeId: { [Op.in]: collegeIds },
            },
            attributes: ["collegeId", "roles"],
            raw: true,
        });

        const collegesWithAccounts = new Set(
            usersWithCollegeId
                .filter((user) => {
                    try {
                        const roles = typeof user.roles === "string" ? JSON.parse(user.roles) : user.roles;
                        return roles?.institution === true && user.collegeId;
                    } catch {
                        return false;
                    }
                })
                .map((user) => user.collegeId)
                .filter(Boolean)
        );

        const itemsWithAccountStatus = items.map((college) => {
            const collegeData = college.toJSON ? college.toJSON() : college;
            return {
                ...collegeData,
                has_account: collegesWithAccounts.has(college.id),
            };
        });

        return {
            items: itemsWithAccountStatus,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                limit,
                totalCount,
            },
        };
    }

    async getSchoolBySlug(slugs) {
        const school = await College.findOne({
            where: {
                slugs,
                [Op.and]: [
                    Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
                ],
            },
            attributes: {
                exclude: ["author_id", "university_id"],
            },
            include: [
                {
                    model: CollegeFacility,
                    as: "facilities",
                    attributes: ["title", "description", "icon"],
                },
                {
                    model: CollegeAddress,
                    as: "address",
                    attributes: ["country", "state", "city", "street", "postal_code"],
                },
                {
                    model: CollegeContact,
                    as: "contacts",
                    attributes: ["contact_number"],
                },
                {
                    model: CollegeGallery,
                    as: "collegeGallery",
                },
                {
                    model: CollegeCourse,
                    as: "collegeCourses",
                    include: [
                        {
                            model: Program,
                            as: "program",
                            attributes: ["id", "title", "slugs"],
                        },
                    ],
                },
                {
                    model: CollegeMember,
                    as: "collegeMembers",
                    attributes: ["name", "contact_number", "role", "description"],
                },
                {
                    model: CollegeAdmission,
                    as: "collegeAdmissions",
                    include: [
                        {
                            model: Program,
                            as: "program",
                            attributes: ["title", "slugs"],
                        },
                    ],
                },
                {
                    model: University,
                    as: "university",
                    attributes: ["fullname", "slugs"],
                },
                {
                    model: UserModel,
                    as: "authorDetails",
                    attributes: ["firstName", "middleName", "lastName"],
                },
            ],
        });

        if (!school) {
            const error = new Error("School not found!");
            error.status = 404;
            throw error;
        }

        return school;
    }
}

export default new SchoolService();
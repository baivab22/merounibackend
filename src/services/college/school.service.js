import { Op, Sequelize } from "sequelize";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import CollegeProgram from "../../models/college/CollegeProgram.model.js";
import CollegeMember from "../../models/college/CollegeMember.model.js";
import CollegeAdmission from "../../models/college/CollegeAdmission.model.js";
import CollegeGallery from "../../models/college/CollegeGallery.model.js";
import CollegeFacility from "../../models/college/CollegeFacility.model.js";
import { University } from "../../models/university/University.model.js";
import Program from "../../models/program/Program.model.js";
import UserModel from "../../models/users/User.model.js";
import CollegeUniversity from "../../models/college/CollegeUniversity.model.js";
import Board from "../../models/board/Board.model.js";
import Stream from "../../models/stream/Stream.model.js";
import CollegeBoard from "../../models/college/CollegeBoard.model.js";
import CollegeStream from "../../models/college/CollegeStream.model.js";



import { sequelize } from "../../config/database.config.js";

const parseFilter = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return val.split(",").map((v) => v.trim()).filter(Boolean);
    return [val];
};

class SchoolService {
    async listSchools(query = {}, isAdmin = false) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 24;
        const sort = (query.sort || "asc").toUpperCase();
        const search = query.q || "";

        const types = parseFilter(query.type);
        const affiliations = parseFilter(query.affiliation || query.university);
        const boardIds = parseFilter(query.board_ids || query.board_id);
        const streamIds = parseFilter(query.stream_ids || query.stream_id);
        const status = query.status;


        const offset = (page - 1) * limit;

        const whereCondition = {
            [Op.and]: [
                Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
            ],
        };

        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%` };
        }

        if (types.length > 0) {
            whereCondition.institute_type = { [Op.in]: types };
        }

        if (isAdmin) {
            if (status && status !== 'all') {
                whereCondition.status = status;
            }
        } else {
            whereCondition.status = "published";
        }

        if (affiliations.length > 0) {
            const matchedUniversities = await University.findAll({
                where: {
                    [Op.or]: [
                        { id: { [Op.in]: affiliations.filter((a) => !isNaN(a)) } },
                        { fullname: { [Op.in]: affiliations } },
                        { slugs: { [Op.in]: affiliations } },
                    ],
                },
                attributes: ["id"],
                raw: true,
            });

            const universityIds = matchedUniversities.map((u) => u.id);

            if (universityIds.length > 0) {
                const collegeWithUniversities = await CollegeUniversity.findAll({
                    where: { university_id: { [Op.in]: universityIds } },
                    attributes: ["college_id"],
                    raw: true,
                });
                const collegeIds = collegeWithUniversities.map((cu) => cu.college_id);
                whereCondition.id = { [Op.in]: collegeIds };
            } else {
                whereCondition.id = { [Op.in]: [] };
            }
        }

        if (boardIds.length > 0) {
            const collegeBoards = await CollegeBoard.findAll({
                where: { board_id: { [Op.in]: boardIds } },
                attributes: ["college_id"],
                raw: true,
            });
            const collegeIds = collegeBoards.map((cb) => cb.college_id);
            if (whereCondition.id) {
                whereCondition.id = { [Op.and]: [whereCondition.id, { [Op.in]: collegeIds }] };
            } else {
                whereCondition.id = { [Op.in]: collegeIds };
            }
        }

        if (streamIds.length > 0) {
            const collegeStreams = await CollegeStream.findAll({
                where: { stream_id: { [Op.in]: streamIds } },
                attributes: ["college_id"],
                raw: true,
            });
            const collegeIds = collegeStreams.map((cs) => cs.college_id);
            if (whereCondition.id) {
                whereCondition.id = { [Op.and]: [whereCondition.id, { [Op.in]: collegeIds }] };
            } else {
                whereCondition.id = { [Op.in]: collegeIds };
            }
        }



        const include = [
            {
                model: CollegeAddress,
                as: "address",
                attributes: ["country", "district", "city", "street", "postal_code"],
            },
            {
                model: CollegeGallery,
                as: "collegeGallery",
            },
        ];
        const { count: totalCount, rows: items } = await College.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            distinct: true,
            order: [
                [Sequelize.literal("order_no_for_website IS NULL"), "ASC"],
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
                exclude: ["author_id"],
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
                    attributes: ["country", "district", "city", "street", "postal_code"],
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
                    model: CollegeProgram,
                    as: "collegePrograms",
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
                    as: "universities",
                    attributes: ["fullname", "slugs", "id"],
                },
                {
                    model: Board,
                    as: "boards",
                    attributes: ["name", "id"],
                    through: { attributes: [] },
                },
                {
                    model: Stream,
                    as: "streams",
                    attributes: ["name", "id"],
                    through: { attributes: [] },
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

        const schoolData = school.get({ plain: true });
        // Robust JSON parsing
        if (typeof schoolData.faqs === 'string') {
          try { schoolData.faqs = JSON.parse(schoolData.faqs); } catch (e) { schoolData.faqs = []; }
        }
        if (typeof schoolData.institute_level === 'string') {
          try { schoolData.institute_level = JSON.parse(schoolData.institute_level); } catch (e) { schoolData.institute_level = []; }
        }
        return schoolData;
    }

    async updateSchoolOrder(schools) {
        const transaction = await sequelize.transaction();
        try {
            // Validate all school IDs exist and are actually schools
            const schoolIds = schools.map((s) => s.id);
            const existingSchools = await College.findAll({
                where: {
                    id: { [Op.in]: schoolIds },
                    [Op.and]: [
                        Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
                    ],
                },
                transaction,
            });

            if (existingSchools.length !== schoolIds.length) {
                const error = new Error("Invalid school IDs or some items are not schools");
                error.status = 400;
                throw error;
            }

            // Update order_no_for_website for each school
            const updates = schools.map((school) =>
                College.update(
                    { order_no_for_website: school.order_no },
                    { where: { id: school.id }, transaction }
                )
            );

            await Promise.all(updates);
            await transaction.commit();

            return { message: "School order updated successfully" };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async listSchoolAffiliations() {
        const universities = await University.findAll({
            include: [
                {
                    model: College,
                    as: "colleges",
                    required: true,
                    where: {
                        [Op.and]: [
                            Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
                        ],
                    },
                    attributes: [],
                    through: { attributes: [] },
                }
            ],
            attributes: ["id", "fullname", "slugs"],
            group: ["University.id", "University.fullname", "University.slugs"],
            order: [["fullname", "ASC"]],
        });

        return universities;
    }

    async listSchoolBoards() {
        const boards = await Board.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]],
        });

        return boards;
    }

    async listSchoolStreams() {
        const streams = await Stream.findAll({
            attributes: ["id", "name"],
            order: [["name", "ASC"]],
        });

        return streams;
    }

}


export default new SchoolService();
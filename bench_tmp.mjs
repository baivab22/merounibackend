/**
 * TEMPORARY perf/shape benchmark for CollegeService.listColleges.
 * Usage: DB_HOST=127.0.0.1 DB_USER=root DB_PASS= DB_NAME=merouni_perf node bench_tmp.mjs
 * Writes bench_result_tmp.json next to this file.
 */
import fs from "node:fs";
import "dotenv/config";

import { sequelize } from "./src/config/database.config.js";

// keep the benchmark output readable
sequelize.options.logging = false;

import "./src/models/blogs/associations.js";
import "./src/models/career/associations.js";
import "./src/models/college/associations.js";
import "./src/models/events/associations.js";
import "./src/models/faculty/associations.js";
import "./src/models/news/associations.js";
import "./src/models/program/associations.js";
import "./src/models/scholarship/associations.js";
import "./src/models/vacancy/associations.js";

import College from "./src/models/college/College.model.js";
import CollegeAddress from "./src/models/college/CollegeAddress.model.js";
import CollegeFacility from "./src/models/college/CollegeFacility.model.js";
import CollegeMember from "./src/models/college/CollegeMember.model.js";
import CollegeGallery from "./src/models/college/CollegeGallery.model.js";
import CollegeOfferingProgram from "./src/models/college/CollegeOfferingProgram.model.js";
import CollegeOfferingDegrees from "./src/models/college/CollegeOfferingDegrees.model.js";
import CollegeUniversity from "./src/models/college/CollegeUniversity.model.js";
import Degree from "./src/models/degree/Degree.model.js";
import { University } from "./src/models/university/University.model.js";
import Program from "./src/models/program/Program.model.js";
import UserModel from "./src/models/users/User.model.js";
import CollegeService from "./src/services/college/College.service.js";

const DISTRICTS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Butwal",
  "Dharan",
  "Biratnagar",
  "Janakpur",
  "Nepalgunj",
];

const seed = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS=0");
  await sequelize.sync({ force: true });
  await sequelize.query("SET FOREIGN_KEY_CHECKS=1");

  await UserModel.create({
    id: 1,
    firstName: "Seed",
    lastName: "User",
    email: "seed@example.com",
    password: "x",
    phoneNo: "9800000001",
    roles: { student: true },
  });

  const degrees = await Degree.bulkCreate(
    Array.from({ length: 12 }, (_, i) => ({
      title: `Degree ${i + 1}`,
      slug: `degree-${i + 1}`,
      short_name: `D${i + 1}`,
      status: "published",
    })),
  );

  const programs = await Program.bulkCreate(
    Array.from({ length: 40 }, (_, i) => ({
      title: `Program ${i + 1}`,
      slug: `program-${i + 1}`,
      code: `P${i + 1}`,
    })),
  );

  const universities = await University.bulkCreate(
    Array.from({ length: 4 }, (_, i) => ({
      fullname: `University ${i + 1}`,
      slug: `university-${i + 1}`,
      author_id: 1,
      country: "Nepal",
      map: "[]",
    })),
  );

  const COLLEGE_COUNT = 143;
  // Roughly reproduces the production row-multiplication:
  // facilities x members x programs x gallery x degrees x universities
  const PER = { facilities: 4, members: 5, programs: 10, gallery: 15, degrees: 2, universities: 1 };

  const collegeRows = [];
  for (let i = 1; i <= COLLEGE_COUNT; i++) {
    collegeRows.push({
      name: `College ${i}`,
      slug: `college-${i}`,
      institute_type: i % 2 ? "Public" : "Private",
      institute_level: JSON.stringify(["Bachelor"]),
      featured_img: "img.jpg",
      college_logo: "logo.png",
      college_broucher: "b.pdf",
      author_id: 1,
      description: `Description for college ${i}`,
      content: `<p>Content ${i}</p>`,
      status: "published",
      order_no_for_website: i % 3 === 0 ? i : null,
      is_referable: i % 5 === 0,
      is_verified: i % 4 === 0,
    });
  }
  const colleges = await College.bulkCreate(collegeRows);

  const addressRows = [];
  const facilityRows = [];
  const memberRows = [];
  const galleryRows = [];
  const offeringRows = [];
  const degreeRows = [];
  const uniRows = [];

  colleges.forEach((c, idx) => {
    addressRows.push({
      college_id: c.id,
      country: "Nepal",
      district: DISTRICTS[idx % DISTRICTS.length],
      city: `City ${idx % DISTRICTS.length}`,
      street: "Street",
      postal_code: "44600",
    });

    for (let k = 0; k < PER.facilities; k++) {
      facilityRows.push({
        college_id: c.id,
        title: `Facility ${k}`,
        description: "desc",
        icon: "icon",
      });
    }
    for (let k = 0; k < PER.members; k++) {
      memberRows.push({
        college_id: c.id,
        name: `Member ${k}`,
        contact_number: "9800000000",
        role: "Principal",
        description: "desc",
        image_url: "m.png",
      });
    }
    for (let k = 0; k < PER.gallery; k++) {
      galleryRows.push({
        college_id: c.id,
        file_type: "image",
        file_url: `https://uploads.example.com/gallery/${c.id}-${k}.jpg`,
      });
    }
    for (let k = 0; k < PER.programs; k++) {
      offeringRows.push({
        college_id: c.id,
        program_id: programs[(idx + k) % programs.length].id,
        fee: "100000",
        placement: "90%",
        scholarship: "20%",
      });
    }
    for (let k = 0; k < PER.degrees; k++) {
      degreeRows.push({
        college_id: c.id,
        degree_id: degrees[(idx + k) % degrees.length].id,
      });
    }
    for (let k = 0; k < PER.universities; k++) {
      uniRows.push({
        college_id: c.id,
        university_id: universities[(idx + k) % universities.length].id,
      });
    }
  });

  await CollegeAddress.bulkCreate(addressRows);
  await CollegeFacility.bulkCreate(facilityRows);
  await CollegeMember.bulkCreate(memberRows);
  await CollegeGallery.bulkCreate(galleryRows);
  await CollegeOfferingProgram.bulkCreate(offeringRows);
  await CollegeOfferingDegrees.bulkCreate(degreeRows);
  await CollegeUniversity.bulkCreate(uniRows);

  console.log(
    `Seeded ${colleges.length} colleges, ${facilityRows.length} facilities, ` +
      `${memberRows.length} members, ${galleryRows.length} gallery rows, ` +
      `${offeringRows.length} offerings, ${degreeRows.length} degree links, ` +
      `${uniRows.length} university links`,
  );
};

const SCENARIOS = [
  ["limit=1", { page: 1, limit: 1 }],
  ["limit=5", { page: 1, limit: 5 }],
  ["limit=10", { page: 1, limit: 10 }],
  ["limit=24", { page: 1, limit: 24 }],
  ["limit=24 page=2", { page: 2, limit: 24 }],
  ["limit=24 districts", { page: 1, limit: 24, districts: "Kathmandu" }],
  ["limit=24 degree_ids", { page: 1, limit: 24, degree_ids: "1,2" }],
  ["limit=24 university_ids", { page: 1, limit: 24, university_ids: "1" }],
  ["limit=24 program_ids", { page: 1, limit: 24, program_ids: "3" }],
  ["limit=24 q", { page: 1, limit: 24, q: "College 1" }],
  ["limit=24 type", { page: 1, limit: 24, type: "Public" }],
  ["limit=100", { page: 1, limit: 100 }],
  ["limit=24 admin draft", { page: 1, limit: 24, status: "draft" }, true],
  ["limit=24 referable", { page: 1, limit: 24, is_referable: "true" }],
];

const run = async () => {
  const doSeed = process.argv.includes("--seed");
  if (doSeed) await seed();

  const service = new CollegeService();
  const timings = [];
  const snapshots = {};

  for (const [label, query, isAdmin] of SCENARIOS) {
    const started = process.hrtime.bigint();
    try {
      const result = await service.listColleges(query, !!isAdmin);
      const ms = Number(process.hrtime.bigint() - started) / 1e6;
      timings.push({ label, ms: Math.round(ms), count: result.items.length, total: result.pagination.totalCount });
      snapshots[label] = result;
    } catch (err) {
      const ms = Number(process.hrtime.bigint() - started) / 1e6;
      timings.push({ label, ms: Math.round(ms), count: "ERR", total: err.message.slice(0, 60) });
    }
  }
  console.table(timings);
  fs.writeFileSync(
    new URL("./bench_result_tmp.json", import.meta.url),
    JSON.stringify({ timings, snapshots }, null, 2),
  );
  console.log("wrote bench_result_tmp.json");
};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

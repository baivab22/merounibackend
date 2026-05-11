import fs from "fs";
import path from "path";

const filesToUpdate = [
  "src/services/level/Level.service.js",
  "src/services/event/Event.service.js",
  "src/services/exam/Exam.service.js",
  "src/services/program/Program.service.js",
  "src/services/consultancy/Consultancy.service.js",
  "src/services/college/school.service.js",
  "src/services/college/College.service.js",
  "src/services/university/University.service.js",
  "src/services/scholarship/Scholarship.service.js",
  "src/services/vacancy/Vacancy.service.js",
  "src/services/category/Category.service.js",
  "src/services/course/Course.service.js",
  "src/services/career/Career.service.js",
  "src/services/faculty/Faculty.service.js",
  "src/controllers/school/School.controller.js",
  "src/controllers/event/Event.controller.js",
  "src/controllers/discipline/Discipline.controller.js",
  "src/controllers/college/College.controller.js",
  "src/controllers/level/Level.controller.js",
  "src/controllers/exam/Exam.controller.js",
  "src/controllers/program/Program.controller.js",
  "src/controllers/consultancy/Consultancy.controller.js",
  "src/controllers/vacancy/Vacancy.controller.js",
  "src/controllers/category/Category.controller.js",
  "src/controllers/scholarship/Scholarship.controller.js",
  "src/controllers/course/Course.controller.js",
  "src/controllers/career/Career.controller.js",
  "src/controllers/faculty/Faculty.controller.js",
  "src/utils/activityLogDetails.js",
  "src/routes/level/Level.route.js",
  "src/routes/event/Event.route.js",
  "src/routes/discipline/Discipline.route.js",
  "src/routes/college/College.route.js",
  "src/routes/exam/Exam.route.js",
  "src/routes/program/Program.route.js",
  "src/routes/consultancy/Consultancy.route.js",
  "src/routes/vacancy/Vacancy.route.js",
  "src/routes/category/Category.route.js",
  "src/routes/scholarship/Scholarship.route.js",
  "src/routes/course/Course.route.js",
  "src/routes/career/Career.route.js",
  "src/routes/faculty/Faculty.route.js",
  "src/routes/university/University.route.js",
  "src/validators/common/common.validator.js",
];

filesToUpdate.forEach((file) => {
  const fullPath = path.join("/Users/sdsys/Files/merouni.com/backend", file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");

    // Replace .slugs with .slug
    content = content.replace(/\.slugs\b/g, ".slug");

    // Replace req.params.slugs with req.params.slug
    content = content.replace(/req\.params\.slugs\b/g, "req.params.slug");

    // Replace where: { slugs } with where: { slug }
    content = content.replace(/where:\s*{\s*slugs/g, "where: { slug");

    // Replace slugs: with slug: where appropriate (we did some manually, but this covers missed ones)
    content = content.replace(/slugs:/g, "slug:");

    // Replace { slugs } destructuring
    content = content.replace(
      /{([^}]*)\bslugs\b([^}]*)}/g,
      (match, p1, p2) => `{${p1}slug${p2}}`,
    );

    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`Updated ${file}`);
  }
});

import { Op } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import SearchTerm from "../../models/search/SearchTerm.model.js";
import College from "../../models/college/College.model.js";
import Faculty from "../../models/faculty/Faculty.model.js";
import Event from "../../models/events/Event.model.js";
import Blog from "../../models/blogs/Blog.model.js";
import { Exam } from "../../models/exams/Exam.model.js";
import Material from "../../models/materials/Material.model.js";
import { University } from "../../models/university/University.model.js";
import News from "../../models/news/News.model.js";
import Scholarship from "../../models/scholarship/Scholarship.model.js";
import Consultancy from "../../models/consultancy/Consultancy.model.js";
import SkillsBasedCourse from "../../models/skills-based-courses/SkillsBasedCourse.model.js";
import Video from "../../models/video/Video.model.js";
import Degree from "../../models/degree/Degree.model.js";

class HomeService {
  async search(q) {
    const searchQuery = q || "";
    if (!searchQuery) {
      const error = new Error("Search query is required.");
      error.status = 400;
      throw error;
    }

    // Log the search term asynchronously (fire and forget)
    this.logSearchTerm(searchQuery).catch(err => console.error("Error logging search term:", err));

    const searchCondition = { [Op.like]: `%${searchQuery}%` };

    const [
      colleges,
      faculty,
      events,
      blogs,
      exams,
      materials,
      university,
      news,
      scholarships,
      consultancies,
      skills,
      videos,
      degrees
    ] = await Promise.all([
      College.findAll({
        where: { name: searchCondition },
        attributes: [['id', 'id'], ['name', 'title'], ['slugs', 'slugs'],['featured_img','featured_img'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'colleges' }))),

      Faculty.findAll({
        where: { title: searchCondition },
        attributes: [['id', 'id'], ['title', 'title'], ['slugs', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'faculty' }))),

      Event.findAll({
        where: { title: searchCondition },
        attributes: [['id', 'id'], ['title', 'title'], ['slugs', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'event' }))),

      Blog.findAll({
        where: { title: searchCondition, status: 'published' },
        attributes: [['id', 'id'], ['title', 'title'],['featured_image','image'], ['slug', 'slugs'], ['createdAt', 'createdAt']], // Note: Blog likely uses 'slug' not 'slugs' based on typical patterns, but mapping to 'slugs' for consistency
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'blog' }))),

      Exam.findAll({
        where: { title: searchCondition },
        attributes: [['id', 'id'], ['title', 'title'], ['slugs', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'exams' }))),

      Material.findAll({
        where: { title: searchCondition },
        attributes: [['id', 'id'], ['title', 'title'], ['slug', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'materials' }))),

      University.findAll({
        where: { fullname: searchCondition },
        attributes: [['id', 'id'], ['fullname', 'title'],['logo','featured_img'], ['slugs', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'university' }))),

      News.findAll({
        where: { title: searchCondition, status: 'published' },
        attributes: [['id', 'id'], ['title', 'title'], ['slug', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'news' }))),

      Scholarship.findAll({
        where: { name: searchCondition },
        attributes: [['id', 'id'], ['name', 'title'], ['slugs', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'scholarship' }))),

      Consultancy.findAll({
        where: { title: searchCondition, status: 'published' },
        attributes: [['id', 'id'], ['title', 'title'], ['slugs', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'consultancy' }))),

      SkillsBasedCourse.findAll({
        where: { title: searchCondition },
        attributes: [['id', 'id'], ['title', 'title'], ['slug', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'skill_course' }))),

      Video.findAll({
        where: { title: searchCondition },
        attributes: [['id', 'id'], ['title', 'title'], ['slug', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'video' }))),

      Degree.findAll({
        where: {
          [Op.or]: [
            { title: searchCondition },
            { short_name: searchCondition }
          ]
        },
        attributes: [['id', 'id'], ['title', 'title'], ['slug', 'slugs'], ['createdAt', 'createdAt']],
        order: [['createdAt', 'DESC']]
      }).then(items => items.map(i => ({ ...i.toJSON(), type: 'degree' })))
    ]);

    return {
      colleges,
      faculty,
      events,
      blogs,
      exams,
      materials,
      university,
      news,
      scholarships,
      consultancies,
      skills,
      videos,
      degrees,
    };
  }

  async logSearchTerm(term) {
    try {
      const normalizedTerm = term.trim();
      if (!normalizedTerm) return;

      const existingTerm = await SearchTerm.findOne({ where: { term: normalizedTerm } });
      if (existingTerm) {
        await existingTerm.increment('count');
      } else {
        await SearchTerm.create({ term: normalizedTerm, count: 1 });
      }
    } catch (error) {
      console.error("Error logging search term:", error);
    }
  }

  async getPopularSearches() {
    try {
      const popularTerms = await SearchTerm.findAll({
        order: [['count', 'DESC']],
        limit: 10,
        attributes: ['term']
      });
      return popularTerms.map(t => t.term);
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      return [];
    }
  }
}

export default HomeService;

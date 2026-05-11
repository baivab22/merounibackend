import slug from "slug";
import { Op } from "sequelize";

export const generateUniqueSlug = (title) => {
  const baseSlug = slug(title);
  const uniqueId = Math.random().toString(36).slice(2, 8); // 6 chars
  return `${baseSlug}-${uniqueId}`;
};

/**
 * Ensures a slug is unique within a model's table.
 * If the slug exists, it appends a counter or a random string.
 *
 * @param {Object} Model - The Sequelize model to check against
 * @param {string} title - The base title to slugify
 * @param {number|string|null} currentId - The ID of the current record (to exclude it from the check)
 * @param {string|null} manualSlug - A manually provided slug (if any)
 * @returns {Promise<string>} - A unique slug
 */
export const getUniqueSlug = async (
  Model,
  title,
  currentId = null,
  manualSlug = null,
) => {
  let baseSlug = manualSlug ? slug(manualSlug) : slug(title);

  if (!baseSlug) {
    baseSlug = "n-a";
  }

  let uniqueSlug = baseSlug;
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const whereCondition = { slug: uniqueSlug };
    if (currentId) {
      whereCondition.id = { [Op.ne]: currentId };
    }

    const existing = await Model.findOne({ where: whereCondition });

    if (!existing) {
      isUnique = true;
    } else {
      counter++;
      // If manual slug is provided and exists, we must modify it or throw error.
      // Here we append a counter.
      uniqueSlug = `${baseSlug}-${counter}`;

      // To prevent infinite loops in extreme cases
      if (counter > 100) {
        uniqueSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
        isUnique = true;
      }
    }
  }

  return uniqueSlug;
};

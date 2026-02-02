import slug from "slug";

export const generateUniqueSlug = (title) => {
  const baseSlug = slug(title);
  const uniqueId = Math.random().toString(36).slice(2, 8); // 6 chars
  return `${baseSlug}-${uniqueId}`;
};

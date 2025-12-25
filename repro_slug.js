import slug from 'slug';

const payload = {
  id: 1,
  // fullname is missing
  description: "Some update"
};

try {
  const slugs = payload.fullname ? slug(payload.fullname) : undefined;
  console.log("Slug created (safe):", slugs);
} catch (error) {
  console.error("Caught unexpected error:", error.message);
}

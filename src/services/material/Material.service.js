import { Op } from "sequelize";
import slug from "slug";

import { sequelize } from "../../config/database.config.js";
import Category from "../../models/category/Category.model.js";
import Material from "../../models/materials/Material.model.js";
import MaterialCategoryOrder from "../../models/materials/MaterialCategoryOrder.model.js";

class MaterialService {
  _formatMaterial(material, index = 0) {
    const plain = material instanceof Material ? material.get({ plain: true }) : material;
    return {
      title: plain.title,
      id: plain.id,
      position: index + 1,
      parent_id: plain.category_id,
      file_url: plain.file_url,
      createdAt: plain.createdAt,
    };
  }

  async listMaterialsNested(query = {}) {
    const searchQuery = query.q || query.search || "";
    const materialWhere = searchQuery ? { title: { [Op.like]: `%${searchQuery}%` } } : {};

    const materials = await Material.findAll({
      where: materialWhere,
      order: [["createdAt", "DESC"]],
    });

    const categories = await Category.findAll({
      where: { type: "MATERIAL" },
      include: [{
        model: MaterialCategoryOrder,
        as: "materialCategoryOrders",
        where: { context: "MATERIAL" },
        required: false,
      }],
    });

    const categoryMap = {};
    categories.forEach((cat) => {
      const orderInfo = cat.materialCategoryOrders?.[0];
      categoryMap[cat.id] = {
        title: cat.title,
        id: cat.id,
        position: orderInfo ? orderInfo.position : 0,
        parent_id: cat.parent_id,
        subcategories: [],
        materials: [],
      };
    });

    materials.forEach((material) => {
      const catId = material.category_id;
      if (catId && categoryMap[catId]) {
        categoryMap[catId].materials.push(this._formatMaterial(material, categoryMap[catId].materials.length));
      }
    });

    const tree = [];
    Object.values(categoryMap).forEach((node) => {
      if (!node.parent_id) {
        tree.push(node);
      } else {
        const parent = categoryMap[node.parent_id];
        if (parent) parent.subcategories.push(node);
        else tree.push(node);
      }
    });

    const polishNode = (node, depth = 1) => {
      // Sort subcategories by position
      if (node.subcategories?.length > 0) {
        node.subcategories.sort((a, b) => a.position - b.position);
        node.subcategories.forEach(child => polishNode(child, depth + 1));
      }

      // Logic to enforce the "Vibe":
      // 1. If a node has subcategories, it should NEVER show materials directly at this level (Intermediate level vibe).
      // 2. If a node has NO subcategories, it's a leaf. If it has materials, show them.
      // 3. Always clear empty arrays to keep the JSON strictly as requested.

      if (node.subcategories?.length > 0) {
        delete node.materials;
      } else {
        delete node.subcategories;
      }

      if (node.materials?.length === 0) {
        delete node.materials;
      }
    };

    tree.sort((a, b) => a.position - b.position).forEach(node => polishNode(node, 1));

    // Filter out empty root branches to keep the response sharp
    return tree.filter(node => node.subcategories || node.materials);
  }

  async listMaterialsFlat(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = query.q || query.search || "";
    const categoryId = query.category_id;

    const whereCondition = {};
    if (searchQuery) whereCondition.title = { [Op.like]: `%${searchQuery}%` };
    if (categoryId === "unlisted") whereCondition.category_id = null;
    else if (categoryId) whereCondition.category_id = categoryId;

    const { count: totalCount, rows: materials } = await Material.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: Category, as: "category", attributes: ["id", "title"], required: false }],
    });

    return {
      materials: materials?.map((m, i) => this._formatMaterial(m, i)),
      pagination: { currentPage: page, totalPages: Math.ceil(totalCount / limit), limit, totalCount },
    };
  }

  async listByTopic(topicId) {
    const materials = await Material.findAll({
      where: { category_id: topicId },
      order: [["createdAt", "DESC"]],
    });
    return materials.map((m, i) => this._formatMaterial(m, i));
  }

  async getMaterial(id) {
    const material = await Material.findByPk(id);
    if (!material) throw Object.assign(new Error("Material not found"), { status: 404 });
    return this._formatMaterial(material);
  }

  async createMaterial(data) {
    const { title, category_id, file_url, author, image, description } = data;
    if (!author) throw Object.assign(new Error("Author is required"), { status: 400 });
    if (!file_url?.trim()) throw Object.assign(new Error("File URL is required"), { status: 400 });

    let slugParts = [];
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (category) slugParts.push(slug(category.title));
    }
    slugParts.push(slug(title));

    const material = await Material.create({
      title,
      category_id,
      file_url,
      author,
      description,
      image,
      slug: slugParts.join("-")
    });
    return this.getMaterial(material.id);
  }

  async updateMaterial(id, data) {
    const material = await Material.findByPk(id);
    if (!material) throw Object.assign(new Error("Material not found"), { status: 404 });

    const updateData = {};
    const allowedFields = ['title', 'description', 'file_url', 'category_id', 'image'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    if (updateData.file_url !== undefined && !updateData.file_url?.trim()) {
      throw Object.assign(new Error("File URL cannot be empty"), { status: 400 });
    }

    if (updateData.title || updateData.category_id !== undefined) {
      const finalTitle = updateData.title || material.title;
      const finalCatId = updateData.category_id !== undefined ? updateData.category_id : material.category_id;

      let slugParts = [];
      if (finalCatId) {
        const cat = await Category.findByPk(finalCatId);
        if (cat) slugParts.push(slug(cat.title));
      }
      slugParts.push(slug(finalTitle));
      updateData.slug = slugParts.join("-");
    }

    await material.update(updateData);
    return this.getMaterial(id);
  }

  async deleteMaterial(id) {
    const deletedCount = await Material.destroy({ where: { id } });
    if (!deletedCount) throw Object.assign(new Error("Material not found"), { status: 404 });
  }

  async updateCategoryOrder(categoryOrders) {
    const transaction = await sequelize.transaction();
    try {
      for (const order of categoryOrders) {
        const { category_id, parent_id, context, position } = order;
        await MaterialCategoryOrder.upsert(
          { category_id, parent_id: parent_id || null, context: context || "MATERIAL", position },
          { transaction }
        );
      }
      await transaction.commit();
      return { message: "Category order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default MaterialService;

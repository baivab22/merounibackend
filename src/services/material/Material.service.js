import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import Category from "../../models/category/Category.model.js";
import Material from "../../models/materials/Material.model.js";
import MaterialCategoryOrder from "../../models/materials/MaterialCategoryOrder.model.js";

import MaterialHeart from "../../models/materials/MaterialHeart.model.js";

class MaterialService {
  _formatMaterial(material, userId = null) {
    const plain = material instanceof Material ? material.get({ plain: true }) : material;
    
    // Calculate heart count and user status if relations are included
    const hearts_count = plain.hearts ? plain.hearts.length : (plain.hearts_count || 0);
    const is_hearted = userId ? (plain.hearts ? plain.hearts.some(h => h.user_id === userId) : !!plain.is_hearted) : false;

    return {
      title: plain.title,
      id: plain.id,
      position: plain.position || 0,
      parent_id: plain.category_id,
      file_url: plain.file_url,
      createdAt: plain.createdAt,
      description: plain.description,
      hearts_count,
      is_hearted,
    };
  }

  async listMaterialsNested(query = {}) {
    const searchQuery = query.q || query.search || "";
    const userId = query.userId;
    const materialWhere = searchQuery ? { title: { [Op.like]: `%${searchQuery}%` } } : {};

    const materials = await Material.findAll({
      where: materialWhere,
      include: [
        { 
          model: MaterialHeart, 
          as: "hearts", 
          attributes: ["id", "user_id"], 
          required: false 
        }
      ],
      order: [["position", "ASC"], ["createdAt", "DESC"]],
    });

    const categories = await Category.findAll({
      where: { type: "MATERIAL" },
    });

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.id] = {
        title: cat.title,
        id: cat.id,
        position: cat.order_no || 0, // Fallback to order_no if MaterialCategoryOrder is not used
        parent_id: cat.parent_id,
        subcategories: [],
        materials: [],
        materials_count: 0,
        hearts_count: 0,
      };
    });

    materials.forEach((material) => {
      const catId = material.category_id;
      if (catId && categoryMap[catId]) {
        const formatted = this._formatMaterial(material, userId);
        categoryMap[catId].materials.push(formatted);
        categoryMap[catId].materials_count += 1;
        categoryMap[catId].hearts_count += formatted.hearts_count || 0;
      }
    });

    const tree = [];
    Object.values(categoryMap).forEach((node) => {
      if (!node.parent_id) {
        tree.push(node);
      } else {
        const parent = categoryMap[node.parent_id];
        if (parent && parent.id !== node.id) { // Prevent self-circularity
          parent.subcategories.push(node);
        } else {
          tree.push(node);
        }
      }
    });

    const polishNode = (node) => {
      let totalHearts = node.hearts_count || 0;
      if (node.subcategories?.length > 0) {
        node.subcategories.sort((a, b) => a.position - b.position);
        node.subcategories.forEach(child => {
          totalHearts += polishNode(child);
        });
      }
      node.hearts_count = totalHearts;
      return totalHearts;
    };

    tree.sort((a, b) => a.position - b.position).forEach(node => polishNode(node));

    return tree;
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
      include: [
        { model: Category, as: "category", attributes: ["id", "title"], required: false },
        { 
          model: MaterialHeart, 
          as: "hearts", 
          attributes: ["id", "user_id"], 
          required: false 
        }
      ],
      distinct: true, // Needed for findAndCountAll with includes
    });

    return {
      materials: materials?.map((m) => this._formatMaterial(m, query.userId)),
      pagination: { currentPage: page, totalPages: Math.ceil(totalCount / limit), limit, totalCount },
    };
  }

  async listByTopic(topicId, userId = null) {
    const materials = await Material.findAll({
      where: { category_id: topicId },
      include: [
        { 
          model: MaterialHeart, 
          as: "hearts", 
          attributes: ["id", "user_id"], 
          required: false 
        }
      ],
      order: [["position", "ASC"], ["createdAt", "DESC"]],
    });
    return materials.map((m) => this._formatMaterial(m, userId));
  }

  async getMaterial(id) {
    const material = await Material.findByPk(id);
    if (!material) throw Object.assign(new Error("Material not found"), { status: 404 });
    return this._formatMaterial(material);
  }

  async createMaterial(data) {
    const { title, category_id, file_url, author, description } = data;
    if (!author) throw Object.assign(new Error("Author is required"), { status: 400 });

    const material = await Material.create({
      title,
      category_id,
      file_url,
      author,
      description,
    });
    return this.getMaterial(material.id);
  }

  async updateMaterial(id, data) {
    const material = await Material.findByPk(id);
    if (!material) throw Object.assign(new Error("Material not found"), { status: 404 });

    const updateData = {};
    const allowedFields = ['title', 'description', 'file_url', 'category_id'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    await material.update(updateData);
    return this.getMaterial(id);
  }

  async deleteMaterial(id) {
    const deletedCount = await Material.destroy({ where: { id } });
    if (!deletedCount) throw Object.assign(new Error("Material not found"), { status: 404 });
  }

  async updateCategoryOrder(data) {
    const { parent_id, positions, context = "MATERIAL" } = data;
    const transaction = await sequelize.transaction();
    try {
      for (let i = 0; i < positions.length; i++) {
        const category_id = positions[i];
        await MaterialCategoryOrder.upsert(
          {
            category_id,
            parent_id: parent_id || null,
            context,
            position: i + 1
          },
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

  async updateMaterialOrder(data) {
    const { parent_id, positions } = data;
    const transaction = await sequelize.transaction();
    try {
      for (let i = 0; i < positions.length; i++) {
        const material_id = positions[i];
        await Material.update(
          { position: i + 1 },
          {
            where: { id: material_id, category_id: parent_id },
            transaction
          }
        );
      }
      await transaction.commit();
      return { message: "Material order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async toggleHeart(materialId, userId) {
    const material = await Material.findByPk(materialId);
    if (!material) throw Object.assign(new Error("Material not found"), { status: 404 });

    const existingHeart = await MaterialHeart.findOne({
      where: { material_id: materialId, user_id: userId },
    });

    if (existingHeart) {
      await existingHeart.destroy();
    } else {
      await MaterialHeart.create({ material_id: materialId, user_id: userId });
    }

    const heartsCount = await MaterialHeart.count({ where: { material_id: materialId } });
    const isHearted = !existingHeart;

    return { hearts_count: heartsCount, is_hearted: isHearted };
  }
}

export default MaterialService;

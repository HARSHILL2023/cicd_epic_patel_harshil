// src/utils/pagination.util.js

/**
 * Reusable pagination, sorting, and filtering logic
 */
export const getPaginatedData = async (model, query, filter = {}, searchFields = []) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  // Regex Search
  if (query.search && searchFields.length > 0) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = searchFields.map(field => ({ [field]: searchRegex }));
  }

  // Sorting
  const sortField = query.sort || 'createdAt';
  const sortOrder = query.order === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  // Field Projection
  const projection = query.fields ? query.fields.split(',').join(' ') : '-__v';

  const total = await model.countDocuments(filter);
  const items = await model.find(filter)
    .select(projection)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    items
  };
};

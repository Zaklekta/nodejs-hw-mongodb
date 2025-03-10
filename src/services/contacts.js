import ContactCollection from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "_id",
  sortOrder = "asc",
  filter = {},
}) => {
  const query = ContactCollection.find();
  if (filter.userId) {
    query.where("userId").equals(filter.userId);
  }
  const skip = (page - 1) * perPage;
  const data = await query
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await ContactCollection.find()
    .merge(query)
    .countDocuments();
  const paginationData = calculatePaginationData({ totalItems, page, perPage });
  return { data, ...paginationData };
};

export const getContactById = (contactId, userId) =>
  ContactCollection.findOne({ _id: contactId, userId });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({
  _id: contactId,
  userId,
  payload,
  options = {},
}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { contactId, userId },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
    }
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject?.upserted),
  };
};
export const deleteContact = async (contactId, userId) =>
  ContactCollection.findOneAndDelete({ _id: contactId, userId });

import * as v from "valibot";
const propertyStatus = {
  available: "available",
  unavailable: "unavailable",
  pending: "pending",
};

const priceType = {
  monthly: "monthly",
  yearly: "yearly",
  purchase: "purchase",
};

export type TPropertyType = {
  apartment: "apartment";
  house: "house";
  townhouse: "townhouse";
  studio: "studio";
};
const propertyType: TPropertyType = {
  apartment: "apartment",
  house: "house",
  townhouse: "townhouse",
  studio: "studio",
};

export const propertySchema = v.object({
  owner_id: v.number("Owner ID is required and is of type number"),
  title: v.string("Enter property title in string form"),
  description: v.string("Enter property description in string form"),
  property_type: v.pipe(
    v.string("Enter property_type in string form"),
    v.enum(
      propertyType,
      "property_type only accepts 'apartment', 'house', 'townhouse' or 'studio' "
    )
  ),
  price_type: v.pipe(
    v.string("Enter price_type in string form"),
    v.enum(
      priceType,
      "price_type only accepts 'monthly', 'yearly' or 'purchase' "
    )
  ),
  price: v.number("Enter price in number form"),
  address: v.string("Enter property address in string form"),
  city: v.string("Enter property city in string form"),
  area: v.string("Enter property area in string form"),
  bedrooms: v.number("Enter property bedroom in number form"),
  has_parking: v.boolean("Enter property has_parking in boolean form"),
  furnished: v.boolean("Enter property furnished in boolean form"),
  property_status: v.pipe(
    v.string("Enter property_status in string form"),
    v.enum(
      propertyStatus,
      "property_type only accepts 'available', 'unavailable' or 'pending'"
    )
  ),
});

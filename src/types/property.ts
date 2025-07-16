export interface Property {
  id: string;
  message_id: string;
  property_name?: string;
  property_type?: string;
  listing_type: "sale" | "rental" | "lease";
  price?: string;
  price_numeric?: number;
  location?: string;
  area_name?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  floor_number?: number;
  total_floors?: number;
  amenities?: string[];
  furnishing?: "furnished" | "semi-furnished" | "unfurnished";
  parking?: boolean;
  parking_count?: number;
  contact_info?: string;
  availability_date?: string;
  description?: string;
  parsing_confidence?: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  listing_type?: "sale" | "rental" | "lease";
  property_type?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  min_parking_count?: number;
  min_confidence?: number;
  limit?: number;
}

export interface PropertyResponse {
  status: "success" | "error";
  data: Property[];
  message?: string;
}

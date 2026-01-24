// src/lib/types/listing.ts

export interface PDFExtractionResponse {
  success: boolean;
  extractedText: string;
  matchedData: ExtractedYachtData;
  images: string[];
}

export interface ExtractedYachtData {
  yachtName: string;
  builder: string;
  yachtType: string;
  model: string;
  location: string;
  guestCapacity: number | string;
  price: string;
  bathRooms: string;
  bedRooms: string;
  cabins: string;
  crew: string;
  guests: string;
  constructions: {
    GRP: string | boolean;
    STEEL: string | boolean;
    Aluminum: string | boolean;
    Wood: string | boolean;
    Composite: string | boolean;
  };
  yearBuilt: string;
  lengthOverall: {
    value: string;
    unit: string;
  };
  beam: {
    value: string;
    unit: string;
  };
  draft: {
    value: string;
    unit: string;
  };
  grossTons: string;
  engineMake: string;
  engineModel: string;
  description: string;
}

// components/AddressAutocomplete.types.ts
export type PlaceSelection = {
  address: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  raw?: any; // provider result
};

export type AddressAutocompleteProps = {
  placeholder?: string;
  initialValue?: string;
  onSelect: (selection: PlaceSelection) => void;
  onError?: (err: Error | string) => void;
  className?: string; // web-only styling
  style?: any;        // native styling
};

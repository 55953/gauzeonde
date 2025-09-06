// components/AddressAutocomplete.web.tsx
import React, { useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import type { AddressAutocompleteProps, PlaceSelection } from "./AddressAutocomplete.types";

const libraries: ("places")[] = ["places"];

export default function AddressAutocomplete({
  placeholder = "Search address…",
  initialValue = "",
  onSelect,
  onError,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      (process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY as string) ||
      (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string) ||
      "",
    libraries,
  });

  if (loadError) return <div>Failed to load Places.</div>;
  if (!isLoaded) return <div>Loading…</div>;

  const onPlaceChanged = async () => {
    if (!acRef.current) return;
    const place = acRef.current.getPlace();
    try {
      const selection: PlaceSelection = {
        address: place.formatted_address || inputRef.current?.value || "",
        placeId: place.place_id,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        raw: place,
      };
      onSelect(selection);
    } catch (e: any) {
      onError?.(e?.message || "Could not read selected place");
    }
  };

  return (
    <Autocomplete
      onLoad={(ac) => (acRef.current = ac)}
      onPlaceChanged={onPlaceChanged}
      restrictions={{ country: [] }} // set e.g. ['us'] to restrict
    >
      <input
        ref={inputRef}
        defaultValue={initialValue}
        placeholder={placeholder}
        className={className || "address-input"}
        style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
      />
    </Autocomplete>
  );
}

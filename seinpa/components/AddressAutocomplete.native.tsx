// components/AddressAutocomplete.native.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import type { AddressAutocompleteProps, PlaceSelection } from "./AddressAutocomplete.types";

export default function AddressAutocomplete({
  placeholder = "Search address…",
  initialValue = "",
  onSelect,
  onError,
  style,
}: AddressAutocompleteProps) {
  const key =
    (process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY as string) ||
    (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string) || "";

  return (
    <View style={[styles.container, style]}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        query={{ key, language: "en" }}
        fetchDetails
        enablePoweredByContainer={false}
        textInputProps={{
          defaultValue: initialValue,
        }}
        onPress={(data, details) => {
          try {
            const selection: PlaceSelection = {
              address: details?.formatted_address || data?.description || "",
              lat: details?.geometry?.location?.lat,
              lng: details?.geometry?.location?.lng,
              placeId: details?.place_id || data?.place_id,
              raw: { data, details },
            };
            onSelect(selection);
          } catch (e: any) {
            onError?.(e?.message || "Could not parse selected place");
          }
        }}
        onFail={(e) => onError?.(typeof e === "string" ? e : e?.message || "Places failed")}
        styles={{
          textInput: {
            height: 44,
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
          },
          listView: { zIndex: 10 },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
});

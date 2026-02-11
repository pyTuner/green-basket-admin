import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View } from "react-native";

export default function UnitDropdown({
  units,
  selectedUnit,
  setSelectedUnit,
  style
}: {
  units: any[];
  selectedUnit: string | null;
  setSelectedUnit: React.Dispatch<React.SetStateAction<string | null>>;
  style?: any;
}) {
  return (
    <View style={{...style, padding: 0}}>
      <Picker
        selectedValue={selectedUnit}
        onValueChange={(itemValue: string | null) => setSelectedUnit(itemValue)}
      >
        <Picker.Item label="Select a unit" value={null} />
        {units
          .filter((unit) => unit.visibility)
          .map((unit) => (
            <Picker.Item key={unit._id} label={unit.name} value={unit._id} />
          ))}
      </Picker>
    </View>
  );
}

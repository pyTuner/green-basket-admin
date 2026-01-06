import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View } from "react-native";

export default function CategoryDropdown({
  categories,
  selectedCategory,
  setSelectedCategory,
  style,
}: {
  categories: any[];
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  style?: any;
}) {
  return (
    <View style={{...style, padding: 0}}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue: string | null) =>
          setSelectedCategory(itemValue)
        }
      >
        <Picker.Item label="Select a category" value={null} />
        {categories
          .filter((cat) => cat.visibility)
          .map((category) => (
            <Picker.Item
              key={category._id}
              label={category.name}
              value={category._id}
            />
          ))}
      </Picker>
    </View>
  );
}

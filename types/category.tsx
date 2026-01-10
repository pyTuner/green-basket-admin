export type CategoryItemProps = {
  name: string;
  disabled?: boolean;
  editCategory?: () => void;
  deleteCategory?: () => void;
};
import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/redux/hooks";

export default function Index() {  
  const user = useAppSelector((state) => state.auth.user);
  return user ? (
    <Redirect href="/(tabs)/dashboard" />
  ) : (
    <Redirect href="/login" />
  );
}

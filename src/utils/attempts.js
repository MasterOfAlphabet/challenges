import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAttempt = async (challengeId, status) => {
  try {
    const attempt = { challengeId, status, timestamp: new Date().toISOString() };
    const attempts = await AsyncStorage.getItem("attempts");
    const updatedAttempts = attempts ? JSON.parse(attempts) : [];
    updatedAttempts.push(attempt);
    await AsyncStorage.setItem("attempts", JSON.stringify(updatedAttempts));
    console.log("Attempt saved successfully!");
  } catch (error) {
    console.error("Error saving attempt:", error);
  }
};
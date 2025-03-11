import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateStreak = async (isCorrect) => {
  try {
    const streak = await AsyncStorage.getItem("streak");
    let currentStreak = streak ? parseInt(streak) : 0;

    if (isCorrect) {
      currentStreak += 1;
    } else {
      currentStreak = 0;
    }

    await AsyncStorage.setItem("streak", currentStreak.toString());
    console.log("Streak updated successfully!");
  } catch (error) {
    console.error("Error updating streak:", error);
  }
};
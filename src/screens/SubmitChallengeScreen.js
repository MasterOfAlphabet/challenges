import React from "react";
import { View, Text, Button } from "react-native";

const SubmitChallengeScreen = () => {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}>
        User must login to submit the challenge
      </Text>
      <Text style={{ fontSize: 16 }}>Question: What is the synonym for "Happy"?</Text>

      <Button title="Submit Challenge (Login Required)" disabled={true} />
    </View>
  );
};

export default SubmitChallengeScreen;

import { View, ScrollView, StyleSheet } from "react-native";
import DiagnoseReport from "../../components/DiagnoseReport";

function DiagnoseDetailsScreen({ route }) {
  const data = route.params.data;
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DiagnoseReport selectedSymptom={data.observedSymptom} data={data} />
      </ScrollView>
    </View>
  );
}

export default DiagnoseDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
});

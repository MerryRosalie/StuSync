import { Text, View, TouchableOpacity, TextInput } from "react-native";

export default function CoursesStep({
  courses,
  onAddCourse,
  onRemoveCourse,
  courseInput,
  setCourseInput,
}) {
  return (
    <>
      <Text className="text-2xl font-semibold mb-2 text-text-default dark:text-dark-text-default">
        What courses are you doing?
      </Text>
      <Text className="text-text-default dark:text-dark-text-default mb-6">
        Add courses that you are doing this term so we can start matching you
        up!
      </Text>

      <View className="mb-4">
        <TextInput
          value={courseInput}
          onChangeText={setCourseInput}
          onSubmitEditing={onAddCourse}
          placeholder="Type course code..."
          className="w-full p-4 rounded-xl border border-gray dark:border-gray-700  text-text-default dark:text-dark-text-default"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
        />
        <TouchableOpacity
          onPress={onAddCourse}
          disabled={!courseInput.trim()}
          className={`mt-2 p-3 rounded-xl ${
            courseInput.trim()
              ? "bg-purple-tertiary/25 dark:bg-dark-purple-tertiary/25 border border-purple-default dark:border-dark-purple-default"
              : "bg-gray-300"
          } items-center`}
        >
          <Text className="text-purple-default dark:text-dark-purple-default font-semibold">
            Add Course
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onRemoveCourse(course)}
            className="bg-purple-100 rounded-full px-4 py-2 flex-row items-center"
          >
            <Text className="text-purple-600 mr-2">{course}</Text>
            <Text className="text-purple-600">×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

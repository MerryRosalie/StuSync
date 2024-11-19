import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";

// ImageModal Component - Displays an image in a full-screen modal view
export default function ImageModal({ initialVisibility, image, children }) {
  const [showModal, setShowModal] = useState(initialVisibility || false);
  return (
    <>
      {/* Wrapper that triggers modal open on press */}
      <TouchableOpacity onPress={() => setShowModal(true)}>
        {children}
      </TouchableOpacity>

      {/* Modal only renders if image prop is provided */}
      {image && (
        <Modal
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)} // Close on background tap
          onSwipeComplete={() => setShowModal(false)} // Close on swipe
          swipeDirection={["down"]} // Enable downward swipe to close
          propagateSwipe={true} // Allow swiping on child components
        >
          {/* Container for modal content */}
          <View className="relative p-4 inset-0 flex-1 w-full justify-center">
            {/* Close button */}
            <TouchableOpacity
              className="absolute p-4 top-0 right-0 z-10"
              onPress={() => setShowModal(false)}
            >
              <Feather
                name="x"
                size={32}
                className="color-background shadow-white shadow-lg"
              />
            </TouchableOpacity>
            {/* Full-screen image */}
            <Image
              source={{ uri: image }}
              style={{
                resizeMode: "contain",
                aspectRatio: 1,
              }}
            />
            {/* Image filename */}
            <Text className="mt-2 text-background text-center">
              {image.substring(image.lastIndexOf("/") + 1, image.length)}
            </Text>
          </View>
        </Modal>
      )}
    </>
  );
}

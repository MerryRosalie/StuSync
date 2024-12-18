import React, { forwardRef, useMemo, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TouchableOpacity, View, useColorScheme, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  interpolate,
} from "react-native-reanimated";
import { useCallback } from "react";

// Custom background component for the bottom sheet
// Retrieved from https://gorhom.dev/react-native-bottom-sheet/custom-background
const CustomBackground = ({ style, animatedIndex, targetColor }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [targetColor, targetColor]
    ),
    borderRadius: interpolate(animatedIndex.value, [0, 1], [0, 15]),
  }));

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

// Sheet Component - A customizable bottom sheet
const Sheet = forwardRef(({ children, noExpand }, ref) => {
  const colorScheme = useColorScheme();
  const [contentHeight, setContentHeight] = useState(0);

  // Calculate snap points based on content height
  const snapPoints = useMemo(() => {
    if (contentHeight) {
      const height = Math.min(contentHeight + 8, 600);
      return [height, "100%"];
    } else {
      return ["100%"];
    }
  }, [contentHeight]);

  // Measure content height on layout
  const onLayoutContent = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  }, []);

  // Custom backdrop component
  const renderBackdrop = useMemo(
    () => (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  // Theme configuration
  const theme = useMemo(
    () => ({
      background: colorScheme === "dark" ? "#121212" : "#FFFFFF",
      indicator: colorScheme === "dark" ? "#DCDCDC" : "#353535",
    }),
    [colorScheme]
  );

  // Custom background component setup
  const background = useCallback(
    ({ style, animatedIndex }) => (
      <CustomBackground
        style={style}
        animatedIndex={animatedIndex}
        targetColor={theme.background}
      />
    ),
    [theme.background, colorScheme]
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableDismissOnClose={true}
      backdropComponent={renderBackdrop}
      backgroundComponent={background}
      enableContentPanningGesture={noExpand ? false : true}
      enableHandlePanningGesture={noExpand ? false : true}
      enableDynamicSizing
      handleComponent={() =>
        !noExpand && (
          <View className="self-center">
            <View className="w-16 h-2 rounded-full bg-text-dimmed dark:bg-dark-text-dimmed mt-4" />
          </View>
        )
      }
    >
      <BottomSheetView className="flex-1">
        <ScrollView
          className="flex-1"
          bounces={false}
          overScrollMode="never"
          simultaneousHandlers={ref}
        >
          <View className="flex-1 p-6" onLayout={onLayoutContent}>
            {children}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default Sheet;

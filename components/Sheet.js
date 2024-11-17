import React, { forwardRef, useMemo, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView, View, useColorScheme } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  interpolate,
} from "react-native-reanimated";
import { useCallback } from "react";

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

const Sheet = forwardRef(({ children, noExpand }, ref) => {
  const colorScheme = useColorScheme();
  const [contentHeight, setContentHeight] = useState(0);

  const snapPoints = useMemo(() => {
    const height = Math.min(contentHeight, 600);
    return [height, "100%"];
  }, [contentHeight]);

  const onLayoutContent = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  }, []);

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

  const theme = useMemo(
    () => ({
      background: colorScheme === "dark" ? "#121212" : "#FFFFFF",
      indicator: colorScheme === "dark" ? "#DCDCDC" : "#353535",
    }),
    [colorScheme]
  );

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
        <ScrollView className="flex-1">
          <View onLayout={onLayoutContent} className="flex-1 p-6">
            {children}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default Sheet;

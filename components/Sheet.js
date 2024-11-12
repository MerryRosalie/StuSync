import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { View, useColorScheme } from "react-native";
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
  const snapPoints = useMemo(() => ["100%"], []);

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
      handleComponent={() =>
        !noExpand && (
          <View className="self-center">
            <View className="w-16 h-2 rounded-full bg-text-dimmed dark:bg-dark-text-dimmed mt-4" />
          </View>
        )
      }
    >
      <BottomSheetScrollView className="flex-1">
        <View className="flex-1 p-6">{children}</View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default Sheet;

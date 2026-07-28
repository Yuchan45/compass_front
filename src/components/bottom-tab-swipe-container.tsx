import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import type { NavigationItemKey, NavigationRoute } from '@/components/bottom-navigation-bar';

type BottomTabSwipeContainerProps = {
  activeItem: NavigationItemKey;
  children: ReactNode;
};

const SWIPE_DISTANCE_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 450;

const navigationOrder: {
  key: NavigationItemKey;
  route: NavigationRoute;
}[] = [
  {
    key: 'map',
    route: '/map',
  },
  {
    key: 'meetups',
    route: '/meetups',
  },
  {
    key: 'friends',
    route: '/friends',
  },
  {
    key: 'profile',
    route: '/profile',
  },
];

export function BottomTabSwipeContainer({ activeItem, children }: BottomTabSwipeContainerProps) {
  const router = useRouter();

  function navigateBySwipe(direction: 'left' | 'right') {
    const activeIndex = navigationOrder.findIndex((item) => item.key === activeItem);

    if (activeIndex < 0) {
      return;
    }

    const nextIndex = direction === 'right' ? activeIndex - 1 : activeIndex + 1;
    const nextItem = navigationOrder[nextIndex];

    if (!nextItem) {
      return;
    }

    router.replace(nextItem.route);
  }

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-24, 24])
    .onEnd((event) => {
      const swipedRight =
        event.translationX > SWIPE_DISTANCE_THRESHOLD || event.velocityX > SWIPE_VELOCITY_THRESHOLD;
      const swipedLeft =
        event.translationX < -SWIPE_DISTANCE_THRESHOLD ||
        event.velocityX < -SWIPE_VELOCITY_THRESHOLD;

      if (swipedRight) {
        runOnJS(navigateBySwipe)('right');
      } else if (swipedLeft) {
        runOnJS(navigateBySwipe)('left');
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

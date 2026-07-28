import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { borders, navigationTheme } from '@/constants/design';

export type NavigationItemKey = 'map' | 'meetups' | 'friends' | 'profile';
export type NavigationRoute = '/map' | '/meetups' | '/friends' | '/profile';

type BottomNavigationBarProps = {
  activeItem: NavigationItemKey;
  onCreatePress?: () => void;
};

type NavigationItem = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  key: NavigationItemKey;
  label: string;
  route?: NavigationRoute;
};

const navigationItems: NavigationItem[] = [
  {
    icon: 'map-outline',
    key: 'map',
    label: 'Map',
    route: '/map',
  },
  {
    icon: 'calendar-month-outline',
    key: 'meetups',
    label: 'Meets',
    route: '/meetups',
  },
  {
    icon: 'account-group-outline',
    key: 'friends',
    label: 'Friends',
    route: '/friends',
  },
  {
    icon: 'account',
    key: 'profile',
    label: 'Profile',
    route: '/profile',
  },
];

export function BottomNavigationBar({ activeItem, onCreatePress }: BottomNavigationBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  function pressItem(item: NavigationItem) {
    if (!item.route || item.key === activeItem) {
      return;
    }

    router.push(item.route);
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        <NavigationButton item={navigationItems[0]} activeItem={activeItem} onPress={pressItem} />
        <NavigationButton item={navigationItems[1]} activeItem={activeItem} onPress={pressItem} />

        <Pressable
          accessibilityLabel="Create"
          accessibilityRole="button"
          onPress={onCreatePress}
          style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            color={navigationTheme.colors.centerButtonIcon}
            name="plus"
            size={navigationTheme.dimensions.centerIconSize}
          />
        </Pressable>

        <NavigationButton item={navigationItems[2]} activeItem={activeItem} onPress={pressItem} />
        <NavigationButton item={navigationItems[3]} activeItem={activeItem} onPress={pressItem} />
      </View>
    </View>
  );
}

type NavigationButtonProps = {
  activeItem: NavigationItemKey;
  item: NavigationItem;
  onPress: (item: NavigationItem) => void;
};

function NavigationButton({ activeItem, item, onPress }: NavigationButtonProps) {
  const active = item.key === activeItem;
  const color = active ? navigationTheme.colors.active : navigationTheme.colors.inactive;

  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons
        color={color}
        name={item.icon}
        size={navigationTheme.dimensions.iconSize}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderColor: navigationTheme.colors.border,
    borderTopWidth: borders.defaultWidth,
    backgroundColor: navigationTheme.colors.background,
  },
  bar: {
    height: navigationTheme.dimensions.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: navigationTheme.colors.background,
  },
  item: {
    minHeight: navigationTheme.dimensions.itemMinHeight,
    minWidth: navigationTheme.dimensions.itemMinWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: navigationTheme.dimensions.centerButtonSize,
    height: navigationTheme.dimensions.centerButtonSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: navigationTheme.radii.centerButton,
    backgroundColor: navigationTheme.colors.centerButtonBackground,
  },
  pressed: {
    opacity: navigationTheme.opacity.pressed,
  },
});

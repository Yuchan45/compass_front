export type AvatarPresetStyle = 'thumbs' | 'shapes' | 'disco' | 'pixel-art-neutral';

export type AvatarPreset = {
  id: string;
  style: AvatarPresetStyle;
  url: string;
};

export type AvatarPresetsResponse = {
  data: AvatarPreset[];
};

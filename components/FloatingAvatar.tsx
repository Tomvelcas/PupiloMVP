// components/FloatingAvatar.tsx
import React from 'react';
import { SvgXml } from 'react-native-svg';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

export interface AvatarCustomization {
  seed: string;
  accessoriesProbability?: number;
  hair?: string[];
  eyes?: string[];
  mouth?: string[];
  skinColor?: string[];
}

interface Props {
  avatar: AvatarCustomization;
  size?: number;
}

export default function FloatingAvatar({ avatar, size = 200 }: Props) {
  const svg = createAvatar(adventurer, {
    seed: avatar.seed,
    accessoriesProbability: avatar.accessoriesProbability ?? 70,
    eyes: avatar.eyes,
    mouth: avatar.mouth,
    skinColor: avatar.skinColor,
  }).toString();

  return <SvgXml xml={svg} width={size} height={size} />;
}

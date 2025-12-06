export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Skin {
  id: string;
  name: string;
  rarity: Rarity;
  image: string;
  description: string;
  ability?: {
    name: string;
    damage: number;
    cooldown: number;
  };
  level: number;
  health: number;
  power: number;
}

export interface GameMode {
  id: string;
  name: string;
  reward: number;
  image: string;
  description: string;
}

export type MenuSection = 'main' | 'play' | 'inventory' | 'shop' | 'settings' | 'leaderboard' | 'about';

export const SKINS: Omit<Skin, 'level' | 'health' | 'power'>[] = [
  {
    id: 'skin1',
    name: 'Ч',
    rarity: 'rare',
    image: 'https://static50.tgcnt.ru/posts/_0/9f/9ffe33fbfb2f0ff16ee84648c4f5c664.jpg',
    description: 'Редкий скин'
  },
  {
    id: 'skin2',
    name: 'Друн',
    rarity: 'epic',
    image: 'https://i.pinimg.com/originals/58/d6/c2/58d6c284ead7608b9abaee364cc736ff.jpg',
    description: 'Сосиски и в Мурино. Елисей',
    ability: {
      name: 'Съесть противника',
      damage: 50,
      cooldown: 30
    }
  },
  {
    id: 'skin3',
    name: 'Друн 2',
    rarity: 'legendary',
    image: 'https://yt3.googleusercontent.com/r49JSqa6HeuZDguU99JHSSx8xSS4KSedcYvSxU6AEhDi1tFdcAIY2iN4uuh9sbELUsMAG9QmkA=s900-c-k-c0x00ffffff-no-rj',
    description: 'Ой бля... Паша.',
    ability: {
      name: 'Лазеры из глаз',
      damage: 60,
      cooldown: 20
    }
  }
];

export const GAME_MODES: GameMode[] = [
  {
    id: 'catch',
    name: 'Поймай Фога',
    reward: 5,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Быстрая реакция = монеты'
  },
  {
    id: 'bushes',
    name: 'Найди в кустах',
    reward: 40,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Поиск в темноте'
  },
  {
    id: 'tictactoe',
    name: 'Крестики-нолики',
    reward: 70,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Переиграй Фога'
  },
  {
    id: 'boss',
    name: 'Бой с Фогом',
    reward: 0,
    image: 'https://i.ytimg.com/vi/Ho7zo0yYXFg/maxresdefault.jpg',
    description: 'Требуется скин'
  }
];

export const RARITY_CHANCES = {
  common: 0.90,
  rare: 0.05,
  epic: 0.03,
  legendary: 0.02
};

export const RARITY_COLORS = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

export const RARITY_TEXT = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный'
};


export enum Rarity {
  COMMON = 'Thường',
  RARE = 'Hiếm',
  LEGENDARY = 'Huyền Thoại',
  MYTHICAL = 'Thần Thoại',
  ANCIENT = 'Thái Cổ'
}

export interface FishType {
  id: string;
  name: string;
  rarity: Rarity;
  minWeight: number; // in kg
  maxWeight: number;
  baseValue: number; // price per kg
  difficulty: number; // 1-10
  color: string;
  chance: number;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  multiplier: number;
  level: number;
  maxLevel: number;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseCooldown: number;
  baseDuration: number;
  price: number;
  upgradeCost: number;
}

export interface Bait {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number; // Giá mỗi viên mồi
  rarityBonus: number; 
  weightBonus: number;
}

export interface Character {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  bonusCatchArea: number; // percentage
  bonusLuck: number; // percentage
  bonusIncome: number; // percentage
}

export interface RodGear {
  id: string;
  name: string;
  description: string;
  price: number;
  power: number; // helps reel in faster
  stability: number; // slows down progress loss
}

export interface MapArea {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  fishTypes: string[];
  background: string;
  waterColor: string;
}

export interface Quest {
  id: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  type: 'catch_count' | 'weight_single' | 'earn_money';
}

export interface RodSkin {
  id: string;
  name: string;
  color: string;
  price: number;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  name: string;
  fishName: string;
  weight: number;
}

export interface PlayerStats {
  money: number;
  totalWeight: number;
  caughtCount: number;
  unlockedMaps: string[];
  upgrades: {
    rod: number;
    line: number;
    boat: number;
  };
  skills: { [skillId: string]: { unlocked: boolean; lastUsed: number; level: number } };
  activeBait: string;
  baitsInventory: { [baitId: string]: number }; // Theo dõi số lượng mồi
  activeCharacter: string;
  ownedCharacters: string[];
  activeRodGear: string;
  ownedRodGear: string[];
  collection: { [fishId: string]: number };
  activeSkin: string;
  ownedSkins: string[];
  quests: Quest[];
  lastLoginDate: string;
  localLeaderboard: LeaderboardEntry[];
}

export enum GameStatus {
  IDLE = 'IDLE',
  CASTING = 'CASTING',
  WAITING = 'WAITING',
  HOOKED = 'HOOKED',
  REELING = 'REELING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

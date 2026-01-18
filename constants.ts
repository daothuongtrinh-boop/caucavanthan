
import { FishType, Rarity, UpgradeItem, MapArea, RodSkin, Quest, Skill, Character, RodGear, Bait } from './types';

export const FISH_DATA: FishType[] = [
  { id: 'carp', name: 'Cá Chép Gối', rarity: Rarity.COMMON, minWeight: 2, maxWeight: 15, baseValue: 10, difficulty: 1, color: '#f59e0b', chance: 0.6 },
  { id: 'tilapia', name: 'Cá Rô Phi Cụ', rarity: Rarity.COMMON, minWeight: 1, maxWeight: 8, baseValue: 8, difficulty: 0.8, color: '#64748b', chance: 0.7 },
  { id: 'catfish', name: 'Cá Trê Khổng Lồ', rarity: Rarity.RARE, minWeight: 50, maxWeight: 350, baseValue: 25, difficulty: 2.5, color: '#4b5563', chance: 0.15 },
  { id: 'golden_sturgeon', name: 'Cá Tầm Vàng', rarity: Rarity.RARE, minWeight: 100, maxWeight: 900, baseValue: 45, difficulty: 3.5, color: '#fbbf24', chance: 0.1 },
  { id: 'leviathan', name: 'Thủy Quái Leviathan', rarity: Rarity.LEGENDARY, minWeight: 5000, maxWeight: 25000, baseValue: 120, difficulty: 6, color: '#3b82f6', chance: 0.03 },
  { id: 'ancient_whale', name: 'Cá Voi Cổ Đại', rarity: Rarity.LEGENDARY, minWeight: 50000, maxWeight: 200000, baseValue: 200, difficulty: 7.5, color: '#1e3a8a', chance: 0.015 },
  { id: 'dragon_king', name: 'Long Vương Vạn Cân', rarity: Rarity.MYTHICAL, minWeight: 500000, maxWeight: 2000000, baseValue: 600, difficulty: 9, color: '#ef4444', chance: 0.005 },
  { id: 'kraken', name: 'Quái Vật Kraken', rarity: Rarity.MYTHICAL, minWeight: 1000000, maxWeight: 5000000, baseValue: 800, difficulty: 9.5, color: '#7c3aed', chance: 0.002 },
  { id: 'nebula_ray', name: 'Cá Đuối Tinh Vân', rarity: Rarity.ANCIENT, minWeight: 10000000, maxWeight: 50000000, baseValue: 2000, difficulty: 10, color: '#ec4899', chance: 0.0005 },
  { id: 'godzilla_fish', name: 'Cá Godzilla Thái Cổ', rarity: Rarity.ANCIENT, minWeight: 100000000, maxWeight: 500000000, baseValue: 5000, difficulty: 10, color: '#064e3b', chance: 0.0001 }
];

export const SKILLS: Skill[] = [
  { id: 'focus', name: 'Pháp Nhãn', icon: '👁️', description: 'Làm chậm cá.', baseCooldown: 25, baseDuration: 5, price: 0, upgradeCost: 2000 },
  { id: 'magnet', name: 'Nam Châm', icon: '🧲', description: 'Tăng vùng bắt.', baseCooldown: 40, baseDuration: 4, price: 5000, upgradeCost: 4000 },
  { id: 'iron_line', name: 'Dây Thép', icon: '⛓️', description: 'Không giảm tiến độ.', baseCooldown: 55, baseDuration: 6, price: 15000, upgradeCost: 10000 },
  { id: 'instant', name: 'Kéo Thần Tốc', icon: '⚡', description: 'Tăng tiến độ ngay.', baseCooldown: 80, baseDuration: 0, price: 30000, upgradeCost: 20000 }
];

export const BAITS: Bait[] = [
  { id: 'worm', name: 'Giun Đất', icon: '🪱', description: 'Miễn phí và vô tận.', price: 0, rarityBonus: 1, weightBonus: 1 },
  { id: 'shrimp', name: 'Tôm Tươi', icon: '🦐', description: 'Cá hiếm x2, Cân nặng x1.2.', price: 50, rarityBonus: 2, weightBonus: 1.2 },
  { id: 'meat', name: 'Thịt Bò Mỹ', icon: '🥩', description: 'Cá hiếm x4, Cân nặng x2.', price: 500, rarityBonus: 4, weightBonus: 2 },
  { id: 'golden_bait', name: 'Mồi Vàng Óng', icon: '🟡', description: 'Cá hiếm x8, Cân nặng x5.', price: 5000, rarityBonus: 8, weightBonus: 5 },
  { id: 'god_bait', name: 'Mồi Thần Thánh', icon: '💎', description: 'Dụ quái vật Thái Cổ khổng lồ.', price: 50000, rarityBonus: 25, weightBonus: 12 }
];

export const CHARACTERS: Character[] = [
  { id: 'rookie', name: 'Lính Mới', icon: '🧑‍🌾', description: 'Khởi đầu sự nghiệp.', price: 0, bonusCatchArea: 0, bonusLuck: 0, bonusIncome: 0 },
  { id: 'expert', name: 'Cần Thủ Chuyên Nghiệp', icon: '🕶️', description: '+15% vùng bắt, +10% tiền.', price: 200000, bonusCatchArea: 15, bonusLuck: 5, bonusIncome: 10 },
  { id: 'old_master', name: 'Lão Ngư Độc Cô', icon: '👴', description: '+40% vùng bắt, +30% may mắn.', price: 2000000, bonusCatchArea: 40, bonusLuck: 30, bonusIncome: 20 },
  { id: 'poseidon', name: 'Thần Biển Poseidon', icon: '🔱', description: 'Bậc thầy của đại dương.', price: 10000000, bonusCatchArea: 60, bonusLuck: 50, bonusIncome: 50 }
];

export const ROD_GEAR: RodGear[] = [
  { id: 'wood', name: 'Cần Gỗ', description: 'Cần thô sơ.', price: 0, power: 1, stability: 1 },
  { id: 'carbon', name: 'Cần Carbon', description: 'Nhẹ và chắc chắn.', price: 50000, power: 1.3, stability: 1.2 },
  { id: 'lava_rod', name: 'Cần Hỏa Long', description: 'Sức mạnh từ nham thạch.', price: 500000, power: 1.8, stability: 1.5 },
  { id: 'cosmic_rod', name: 'Cần Tinh Tú', description: 'Kéo cả vũ trụ.', price: 5000000, power: 2.5, stability: 2 }
];

export const MAPS: MapArea[] = [
  { id: 'pond', name: 'Ao Làng', description: 'Cá chép, cá rô.', unlockedAt: 0, fishTypes: ['carp', 'tilapia'], background: '#86efac', waterColor: '#0ea5e9' },
  { id: 'river', name: 'Sông Cái', description: 'Cá tầm, cá trê.', unlockedAt: 10000, fishTypes: ['carp', 'catfish', 'golden_sturgeon'], background: '#4ade80', waterColor: '#0284c7' },
  { id: 'ocean', name: 'Biển Sâu', description: 'Cá voi, quái vật biển.', unlockedAt: 200000, fishTypes: ['catfish', 'golden_sturgeon', 'leviathan', 'ancient_whale'], background: '#16a34a', waterColor: '#075985' },
  { id: 'legend', name: 'Vùng Biển Huyền Thoại', description: 'Nơi ở của các vị thần.', unlockedAt: 5000000, fishTypes: ['leviathan', 'ancient_whale', 'dragon_king', 'kraken', 'nebula_ray', 'godzilla_fish'], background: '#4c1d95', waterColor: '#1e1b4b' }
];

export const UPGRADES: { [key: string]: UpgradeItem } = {
  rod: { id: 'rod', name: 'Kích Thước Vùng Bắt', description: 'Dễ giữ cá hơn.', basePrice: 200, multiplier: 1.6, level: 1, maxLevel: 50 },
  line: { id: 'line', name: 'Độ Bền Dây', description: 'Giảm tốc độ tuột cá.', basePrice: 150, multiplier: 1.5, level: 1, maxLevel: 50 },
  boat: { id: 'boat', name: 'Nâng Cấp Thuyền', description: 'Đi xa hơn.', basePrice: 5000, multiplier: 4, level: 1, maxLevel: 4 }
};

export const ROD_SKINS: RodSkin[] = [
  { id: 'classic', name: 'Cổ Điển', color: '#475569', price: 0, unlocked: true },
  { id: 'neon', name: 'Neon Cyber', color: '#06b6d4', price: 5000, unlocked: false },
  { id: 'lava', name: 'Hỏa Long', color: '#f97316', price: 25000, unlocked: false },
  { id: 'royal', name: 'Hoàng Gia', color: '#eab308', price: 100000, unlocked: false },
  { id: 'dark', name: 'Hắc Ám', color: '#1e1b4b', price: 500000, unlocked: false }
];

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', description: 'Câu được 10 con cá', target: 10, current: 0, reward: 2000, completed: false, type: 'catch_count' },
  { id: 'q2', description: 'Câu cá nặng trên 1,000kg', target: 1000, current: 0, reward: 10000, completed: false, type: 'weight_single' },
  { id: 'q3', description: 'Kiếm 50,000 vàng', target: 50000, current: 0, reward: 20000, completed: false, type: 'earn_money' }
];

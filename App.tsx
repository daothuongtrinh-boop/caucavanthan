
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, PlayerStats, FishType, MapArea, Rarity, RodSkin, Quest, LeaderboardEntry, Skill, Character, RodGear, Bait } from './types';
import { FISH_DATA, UPGRADES, MAPS, ROD_SKINS, INITIAL_QUESTS, SKILLS, CHARACTERS, ROD_GEAR, BAITS } from './constants';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import TensionBar from './components/TensionBar';
import Shop from './components/Shop';
import Collection from './components/Collection';
import Quests from './components/Quests';
import Leaderboard from './components/Leaderboard';
import Skins from './components/Skins';

const STORAGE_KEY = 'fishing_game_v7_final';

const INITIAL_STATS: PlayerStats = {
  money: 500,
  totalWeight: 0,
  caughtCount: 0,
  unlockedMaps: ['pond'],
  upgrades: { rod: 1, line: 1, boat: 1 },
  skills: { 'focus': { unlocked: true, lastUsed: 0, level: 1 } },
  activeBait: 'worm',
  baitsInventory: { 'worm': 99999 },
  activeCharacter: 'rookie',
  ownedCharacters: ['rookie'],
  activeRodGear: 'wood',
  ownedRodGear: ['wood'],
  collection: {},
  activeSkin: 'classic',
  ownedSkins: ['classic'],
  quests: INITIAL_QUESTS,
  lastLoginDate: new Date().toDateString(),
  localLeaderboard: [
    { name: "Lão Ngư", fishName: "Cá Trê Khổng Lồ", weight: 340 },
    { name: "Hải Vương", fishName: "Cá Voi Cổ Đại", weight: 120000 }
  ]
};

const App: React.FC = () => {
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Hợp nhất dữ liệu cũ với INITIAL_STATS để đảm bảo các trường mới (quests, skins, ...) luôn tồn tại
        return {
          ...INITIAL_STATS,
          ...parsed,
          quests: parsed.quests || INITIAL_STATS.quests,
          localLeaderboard: parsed.localLeaderboard || INITIAL_STATS.localLeaderboard,
          ownedSkins: parsed.ownedSkins || INITIAL_STATS.ownedSkins,
          baitsInventory: parsed.baitsInventory || INITIAL_STATS.baitsInventory,
          skills: parsed.skills || INITIAL_STATS.skills,
        };
      } catch (e) {
        return INITIAL_STATS;
      }
    }
    return INITIAL_STATS;
  });

  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const statusRef = useRef<GameStatus>(status);
  statusRef.current = status;

  const [currentMap, setCurrentMap] = useState<MapArea>(MAPS[0]);
  const [activeFish, setActiveFish] = useState<{ type: FishType; weight: number } | null>(null);
  
  const [fishPos, setFishPos] = useState(50);
  const [catcherPos, setCatcherPos] = useState(20); 
  const [progress, setProgress] = useState(30);
  const [isPressing, setIsPressing] = useState(false);
  const [activeSkills, setActiveSkills] = useState<{ [id: string]: number }>({});

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [isGiantEvent, setIsGiantEvent] = useState(false);
  const [eventTimeLeft, setEventTimeLeft] = useState(0);

  const requestRef = useRef<number | undefined>(undefined);
  const velocityRef = useRef(0);
  const fishTargetRef = useRef(50);
  const fishTimerRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const checkEvent = () => {
      const now = new Date();
      const isEventActive = now.getMinutes() % 5 === 0;
      setIsGiantEvent(isEventActive);
      setEventTimeLeft(isEventActive ? 60 - now.getSeconds() : (5 - (now.getMinutes() % 5)) * 60 - now.getSeconds());
    };
    checkEvent();
    const timer = setInterval(checkEvent, 1000);
    return () => clearInterval(timer);
  }, []);

  const useSkill = (skillId: string) => {
    if (statusRef.current !== GameStatus.REELING) return;
    const skill = SKILLS.find(s => s.id === skillId);
    const skillData = stats.skills[skillId];
    if (!skill || !skillData?.unlocked) return;

    const now = Date.now();
    const cd = (skill.baseCooldown - (skillData.level - 1) * 2) * 1000;
    if (now - skillData.lastUsed < cd) return;

    const duration = (skill.baseDuration + (skillData.level - 1) * 1) * 1000;

    if (skillId === 'instant') {
      const bonus = 20 + (skillData.level * 3);
      setProgress(prev => Math.min(100, prev + bonus));
    } else {
      setActiveSkills(prev => ({ ...prev, [skillId]: now + duration }));
    }

    setStats(prev => ({
      ...prev,
      skills: { ...prev.skills, [skillId]: { ...skillData, lastUsed: now } }
    }));
  };

  const updateGame = useCallback((time: number) => {
    if (statusRef.current === GameStatus.REELING && activeFish) {
      const now = Date.now();
      const character = CHARACTERS.find(c => c.id === stats.activeCharacter) || CHARACTERS[0];
      const rod = ROD_GEAR.find(r => r.id === stats.activeRodGear) || ROD_GEAR[0];
      
      const isFocusActive = activeSkills['focus'] && activeSkills['focus'] > now;
      const isMagnetActive = activeSkills['magnet'] && activeSkills['magnet'] > now;
      const isIronLineActive = activeSkills['iron_line'] && activeSkills['iron_line'] > now;

      const gravity = 0.22;
      const lift = 0.55;
      if (isPressing) velocityRef.current += lift;
      else velocityRef.current -= gravity;
      velocityRef.current = Math.max(-5, Math.min(5, velocityRef.current));
      
      setCatcherPos(prev => {
        let next = prev + velocityRef.current;
        if (next <= 0 || next >= 100) { velocityRef.current *= -0.3; return next <= 0 ? 0 : 100; }
        return next;
      });

      if (time > fishTimerRef.current) {
        fishTargetRef.current = 15 + Math.random() * 70;
        const speedBase = 2500 - (activeFish.type.difficulty * 120);
        fishTimerRef.current = time + speedBase + Math.random() * 1200;
      }

      setFishPos(prev => {
        const slowMult = isFocusActive ? 0.15 : 0.6; 
        const ease = (0.02 + (activeFish.type.difficulty * 0.005)) * slowMult;
        return prev + (fishTargetRef.current - prev) * ease;
      });

      const baseArea = isMagnetActive ? 75 : (32 * (1 + character.bonusCatchArea / 100));
      const catcherSize = baseArea - (activeFish.type.difficulty * 0.7) + (stats.upgrades.rod * 0.8);
      const isInside = Math.abs(fishPos - catcherPos) < (catcherSize / 2);

      setProgress(prev => {
        let next = prev;
        if (isInside) next += (0.55 * rod.power);
        else if (!isIronLineActive) next -= (0.12 / rod.stability);
        
        if (next >= 100) { handleSuccess(); return 100; }
        if (next <= 0) { handleFail(); return 0; }
        return next;
      });
    }
    requestRef.current = requestAnimationFrame(updateGame);
  }, [activeFish, isPressing, fishPos, catcherPos, stats, activeSkills]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGame);
    return () => { if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current); };
  }, [updateGame]);

  const handleCast = () => {
    if (statusRef.current !== GameStatus.IDLE) return;
    let currentBaitId = stats.activeBait;
    let stock = stats.baitsInventory[currentBaitId] || 0;
    if (currentBaitId !== 'worm' && stock <= 0) currentBaitId = 'worm';

    setStats(prev => ({
      ...prev,
      activeBait: currentBaitId,
      baitsInventory: {
        ...prev.baitsInventory,
        [currentBaitId]: currentBaitId === 'worm' ? 99999 : (prev.baitsInventory[currentBaitId] || 1) - 1
      }
    }));

    setStatus(GameStatus.CASTING);
    setTimeout(() => {
      setStatus(GameStatus.WAITING);
      setTimeout(() => { if (statusRef.current === GameStatus.WAITING) generateFish(currentBaitId); }, 1200 + Math.random() * 2000);
    }, 600);
  };

  const generateFish = (baitId: string) => {
    const character = CHARACTERS.find(c => c.id === stats.activeCharacter) || CHARACTERS[0];
    const bait = BAITS.find(b => b.id === baitId) || BAITS[0];
    const availableFish = FISH_DATA.filter(f => currentMap.fishTypes.includes(f.id));
    const eventBonus = isGiantEvent ? 0.2 : 0;
    const luckBonus = (character.bonusLuck / 100) + (bait.rarityBonus / 8);
    const weightedPool = availableFish.map(f => ({ ...f, adjChance: f.rarity !== Rarity.COMMON ? f.chance * (1 + luckBonus + eventBonus) : f.chance }));
    const totalChance = weightedPool.reduce((acc, curr) => acc + curr.adjChance, 0);
    let random = Math.random() * totalChance;
    let selectedFish = weightedPool[0];
    for (const f of weightedPool) { if (random < f.adjChance) { selectedFish = f; break; } random -= f.adjChance; }
    const weight = (selectedFish.minWeight + Math.random() * (selectedFish.maxWeight - selectedFish.minWeight)) * (isGiantEvent ? 3 : 1) * bait.weightBonus;
    setActiveFish({ type: selectedFish, weight: Math.floor(weight) });
    setStatus(GameStatus.HOOKED);
  };

  const startReeling = () => { setFishPos(50); setCatcherPos(20); setProgress(30); velocityRef.current = 0; setActiveSkills({}); setStatus(GameStatus.REELING); };

  const handleSuccess = () => {
    if (statusRef.current !== GameStatus.REELING || !activeFish) return;
    const character = CHARACTERS.find(c => c.id === stats.activeCharacter) || CHARACTERS[0];
    const baseValue = Math.floor(activeFish.weight * activeFish.type.baseValue);
    const value = Math.floor(baseValue * (1 + character.bonusIncome / 100));
    setStats(prev => {
      const updatedQuests = prev.quests.map(q => {
        if (q.completed) return q;
        let nc = q.current;
        if (q.type === 'catch_count') nc += 1;
        if (q.type === 'weight_single') nc = Math.max(nc, activeFish.weight);
        if (q.type === 'earn_money') nc += value;
        return { ...q, current: nc, completed: nc >= q.target };
      });
      return {
        ...prev,
        money: prev.money + value,
        totalWeight: prev.totalWeight + activeFish.weight,
        caughtCount: prev.caughtCount + 1,
        collection: { ...prev.collection, [activeFish.type.id]: Math.max(prev.collection[activeFish.type.id] || 0, activeFish.weight) },
        quests: updatedQuests,
        localLeaderboard: [...prev.localLeaderboard, { name: "Bạn", fishName: activeFish.type.name, weight: activeFish.weight }].sort((a,b)=>b.weight-a.weight).slice(0,10)
      };
    });
    setStatus(GameStatus.SUCCESS); setShowResult(true); setTimeout(resetGame, 2500);
  };

  const handleFail = () => { setStatus(GameStatus.FAIL); setShowResult(false); setTimeout(resetGame, 2500); };
  const resetGame = () => { setStatus(GameStatus.IDLE); setActiveFish(null); setProgress(0); setShowResult(null); setIsPressing(false); setActiveSkills({}); };

  const upgradeSkillLevel = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    const sd = stats.skills[skillId];
    if (!skill || !sd) return;
    const cost = skill.upgradeCost * sd.level;
    if (stats.money >= cost) setStats(prev => ({ ...prev, money: prev.money - cost, skills: { ...prev.skills, [skillId]: { ...sd, level: sd.level + 1 } } }));
  };

  const buyItem = (type: string, item: any, amount: number = 1) => {
    const totalCost = item.price * amount;
    if (stats.money < totalCost) return;
    setStats(prev => {
      const next = { ...prev, money: prev.money - totalCost };
      if (type === 'bait') next.baitsInventory = { ...prev.baitsInventory, [item.id]: (prev.baitsInventory[item.id] || 0) + amount };
      else if (type === 'character') { next.ownedCharacters = [...prev.ownedCharacters, item.id]; next.activeCharacter = item.id; }
      else if (type === 'rodGear') { next.ownedRodGear = [...prev.ownedRodGear, item.id]; next.activeRodGear = item.id; }
      else if (type === 'skill') next.skills = { ...prev.skills, [item.id]: { unlocked: true, lastUsed: 0, level: 1 } };
      return next;
    });
  };

  const buySkin = (skin: RodSkin) => {
    if (stats.money < skin.price) return;
    setStats(prev => ({ ...prev, money: prev.money - skin.price, ownedSkins: [...prev.ownedSkins, skin.id], activeSkin: skin.id }));
  };

  const selectItem = (type: string, id: string) => {
    setStats(prev => ({ ...prev, [type === 'bait' ? 'activeBait' : type === 'character' ? 'activeCharacter' : type === 'rodGear' ? 'activeRodGear' : 'activeSkin']: id }));
  };

  const currentRodSkin = ROD_SKINS.find(s => s.id === stats.activeSkin) || ROD_SKINS[0];

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-sky-900 select-none"
      onMouseDown={() => status === GameStatus.REELING && setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)} onMouseLeave={() => setIsPressing(false)}
      onTouchStart={(e) => { if (status === GameStatus.REELING) { e.preventDefault(); setIsPressing(true); } }}
      onTouchEnd={() => setIsPressing(false)}>
      
      <GameCanvas status={status} currentMap={currentMap} activeFish={activeFish} tension={catcherPos} rodColor={currentRodSkin.color} />

      {isGiantEvent && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full font-bungee animate-pulse border-4 border-yellow-400 shadow-2xl z-10 flex items-center gap-2">
          <span>👹 QUÁI VẬT THÁI CỔ TRỖI DẬY 👹</span> <span className="text-sm bg-black/40 px-2 py-0.5 rounded-full">{eventTimeLeft}s</span>
        </div>
      )}

      {status === GameStatus.REELING && activeFish && (
        <>
          <TensionBar fishPos={fishPos} catcherPos={catcherPos} progress={progress} difficulty={activeFish.type.difficulty} rodLevel={stats.upgrades.rod} activeSkills={activeSkills} />
          <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-50">
            {SKILLS.map(skill => {
              const sd = stats.skills[skill.id];
              const now = Date.now();
              const cl = sd ? Math.max(0, Math.ceil(((skill.baseCooldown - (sd.level-1)*2) * 1000 - (now - sd.lastUsed)) / 1000)) : 0;
              return (
                <button key={skill.id} onClick={(e) => { e.stopPropagation(); useSkill(skill.id); }} disabled={!sd?.unlocked || cl > 0}
                  className={`relative w-16 h-16 rounded-2xl border-4 transition-all flex flex-col items-center justify-center
                    ${!sd?.unlocked ? 'bg-slate-800 opacity-50' : cl > 0 ? 'bg-slate-700' : 'bg-indigo-600 border-white hover:scale-110'}`}>
                  <span className="text-2xl">{skill.icon}</span>
                  {cl > 0 && <span className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl text-white font-bungee">{cl}</span>}
                  <span className="text-[7px] font-bold text-white uppercase mt-1">{skill.name} LV.{sd?.level||0}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <UIOverlay 
        stats={stats} 
        status={status} 
        currentMap={currentMap} 
        onCast={handleCast} 
        onOpenShop={() => setActiveModal('shop')} 
        onOpenCollection={() => setActiveModal('collection')} 
        onOpenQuests={() => setActiveModal('quests')} 
        onOpenLeaderboard={() => setActiveModal('leaderboard')} 
        onOpenSkins={() => setActiveModal('skins')} 
        onSelectMap={(m) => { if (stats.totalWeight >= m.unlockedAt) setCurrentMap(m); }} 
      />

      {activeModal === 'shop' && <Shop stats={stats} onClose={() => setActiveModal(null)} onUpgrade={upgradeSkillLevel} onBuyItem={buyItem} onSelectItem={selectItem} />}
      {activeModal === 'collection' && <Collection stats={stats} onClose={() => setActiveModal(null)} />}
      {activeModal === 'quests' && <Quests stats={stats} onClose={() => setActiveModal(null)} />}
      {activeModal === 'leaderboard' && <Leaderboard stats={stats} onClose={() => setActiveModal(null)} />}
      {activeModal === 'skins' && <Skins stats={stats} onClose={() => setActiveModal(null)} onBuySkin={buySkin} onSelectSkin={(id) => selectItem('skin', id)} />}
      
      {status === GameStatus.HOOKED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40">
           <div className="bg-white/10 backdrop-blur-md p-10 rounded-full border-8 border-yellow-400 animate-pulse text-center">
             <div className="text-white font-bungee text-5xl mb-2">!! CÁ CẮN !!</div>
             <div className="text-yellow-400 font-bold mb-6 text-xl uppercase">{activeFish?.type.name}</div>
             <button onClick={startReeling} className="bg-yellow-400 text-blue-900 font-bungee px-14 py-6 rounded-full text-4xl shadow-xl hover:scale-110 active:scale-95 transition-all">KÉO NGAY</button>
           </div>
        </div>
      )}

      {showResult !== null && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[200]">
          <div className="bg-white p-10 rounded-3xl text-center border-8 border-yellow-400 scale-125">
            {showResult ? (
              <>
                <h2 className="text-4xl font-bungee text-green-600">THÀNH CÔNG!</h2>
                <div className="text-6xl my-4">🐟</div>
                <p className="text-2xl font-bold">{activeFish?.type.name}</p>
                <p className="text-5xl text-blue-600 font-bungee mt-2">{activeFish?.weight.toLocaleString()} KG</p>
                <div className="mt-4 bg-yellow-100 p-2 rounded-xl text-yellow-700 font-bungee text-xl">
                  + {Math.floor(activeFish?.weight! * activeFish?.type.baseValue! * (1 + (CHARACTERS.find(c=>c.id===stats.activeCharacter)?.bonusIncome||0)/100)).toLocaleString()} 🪙
                </div>
              </>
            ) : (
              <h2 className="text-4xl font-bungee text-red-600">MẤT DẤU RỒI!</h2>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

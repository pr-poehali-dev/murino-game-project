import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import MainMenu from '@/components/game/MainMenu';
import GameSections from '@/components/game/GameSections';
import WinDialog from '@/components/game/WinDialog';
import { 
  MenuSection, 
  Skin, 
  GameMode, 
  Rarity, 
  SKINS, 
  RARITY_CHANCES 
} from '@/components/game/GameData';

export default function Index() {
  const [currentSection, setCurrentSection] = useState<MenuSection>('main');
  const [coins, setCoins] = useState(100);
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [caseOpening, setCaseOpening] = useState(false);
  const [wonItem, setWonItem] = useState<Skin | null>(null);

  const openCase = () => {
    if (coins < 100) {
      toast({
        title: "Недостаточно монет",
        description: "Нужно 100 монет для открытия кейса",
        variant: "destructive"
      });
      return;
    }

    setCaseOpening(true);
    setCoins(coins - 100);

    setTimeout(() => {
      const random = Math.random();
      let cumulativeChance = 0;
      let wonRarity: Rarity = 'common';

      for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
        cumulativeChance += chance;
        if (random <= cumulativeChance) {
          wonRarity = rarity as Rarity;
          break;
        }
      }

      if (wonRarity === 'common') {
        setCoins(prev => prev + 25);
        toast({
          title: "Выпало 25 монет!",
          description: "Попробуйте еще раз"
        });
        setCaseOpening(false);
      } else {
        const availableSkins = SKINS.filter(s => s.rarity === wonRarity);
        const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
        
        const newSkin: Skin = {
          ...randomSkin,
          level: 1,
          health: 60,
          power: randomSkin.ability?.damage || 10
        };

        setWonItem(newSkin);
        setInventory(prev => [...prev, newSkin]);
        setCaseOpening(false);
      }
    }, 2000);
  };

  const upgradeSkin = (skin: Skin) => {
    if (skin.level >= 10) {
      toast({
        title: "Максимальный уровень",
        description: "Этот скин уже прокачан до максимума",
        variant: "destructive"
      });
      return;
    }

    const upgradeCost = skin.level * 50;
    if (coins < upgradeCost) {
      toast({
        title: "Недостаточно монет",
        description: `Нужно ${upgradeCost} монет для прокачки`,
        variant: "destructive"
      });
      return;
    }

    setCoins(coins - upgradeCost);
    setInventory(prev => prev.map(s => 
      s.id === skin.id && s.level === skin.level
        ? { ...s, level: s.level + 1, health: s.health + 10, power: s.power + 5 }
        : s
    ));

    toast({
      title: "Прокачка успешна!",
      description: `${skin.name} теперь ${skin.level + 1} уровня`
    });
  };

  const playGame = (mode: GameMode) => {
    if (mode.id === 'boss' && inventory.length === 0) {
      toast({
        title: "Требуется скин",
        description: "Откройте кейс, чтобы получить скин для боя",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `${mode.name}`,
      description: "Игровой режим скоро будет доступен"
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30 glow-red">
        <Icon name="Coins" className="text-primary" size={24} />
        <span className="text-xl font-bold text-horror">{coins}</span>
      </div>

      {currentSection === 'main' && (
        <MainMenu onSelectSection={setCurrentSection} />
      )}

      <GameSections
        currentSection={currentSection}
        onBack={() => setCurrentSection('main')}
        inventory={inventory}
        coins={coins}
        caseOpening={caseOpening}
        onOpenCase={openCase}
        onUpgradeSkin={upgradeSkin}
        onPlayGame={playGame}
      />

      <WinDialog wonItem={wonItem} onClose={() => setWonItem(null)} />
    </div>
  );
}

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { MenuSection } from './GameData';

interface MainMenuProps {
  onSelectSection: (section: MenuSection) => void;
}

export default function MainMenu({ onSelectSection }: MainMenuProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center mb-12 animate-scale-in">
        <h1 className="text-7xl md:text-9xl mb-4 text-primary text-horror animate-pulse-glow">
          МУРИНО
        </h1>
        <p className="text-xl text-muted-foreground">Тёмная игра с Фогом</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full">
        {[
          { id: 'play', icon: 'Gamepad2', label: 'Играть' },
          { id: 'online', icon: 'Users', label: 'Онлайн' },
          { id: 'inventory', icon: 'Package', label: 'Инвентарь' },
          { id: 'shop', icon: 'ShoppingCart', label: 'Магазин' },
          { id: 'settings', icon: 'Settings', label: 'Настройки' },
          { id: 'leaderboard', icon: 'Trophy', label: 'Рейтинг' },
          { id: 'about', icon: 'Info', label: 'О игре' }
        ].map((item) => (
          <Button
            key={item.id}
            onClick={() => onSelectSection(item.id as MenuSection)}
            className="h-32 text-2xl bg-card hover:bg-card/80 border-2 border-primary/50 hover:border-primary transition-all glow-red hover:glow-red-intense"
            variant="outline"
          >
            <div className="flex flex-col items-center gap-2">
              <Icon name={item.icon as any} size={40} className="text-primary" />
              <span className="text-horror">{item.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
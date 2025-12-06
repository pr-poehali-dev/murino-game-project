import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skin, RARITY_COLORS, RARITY_TEXT } from './GameData';

interface WinDialogProps {
  wonItem: Skin | null;
  onClose: () => void;
}

export default function WinDialog({ wonItem, onClose }: WinDialogProps) {
  return (
    <Dialog open={wonItem !== null} onOpenChange={onClose}>
      <DialogContent className="bg-card border-primary/30 glow-red-intense">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-horror animate-pulse-glow">
            🎉 Поздравляем! 🎉
          </DialogTitle>
        </DialogHeader>
        {wonItem && (
          <div className="text-center">
            <div className="aspect-square max-w-xs mx-auto mb-4 rounded-lg overflow-hidden">
              <img 
                src={wonItem.image} 
                alt={wonItem.name}
                className="w-full h-full object-cover animate-scale-in"
              />
            </div>
            <Badge className={`mb-2 ${RARITY_COLORS[wonItem.rarity]}`}>
              {RARITY_TEXT[wonItem.rarity]}
            </Badge>
            <h3 className="text-2xl mb-2 text-horror">{wonItem.name}</h3>
            <p className="text-muted-foreground mb-4">{wonItem.description}</p>
            {wonItem.ability && (
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="font-bold text-primary mb-1">{wonItem.ability.name}</p>
                <p className="text-sm text-muted-foreground">
                  Урон: {wonItem.ability.damage} | КД: {wonItem.ability.cooldown}с
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

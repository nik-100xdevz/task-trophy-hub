
import { Check } from "lucide-react";

export type BadgeType = "bronze" | "silver" | "gold" | "platinum";

interface AchievementBadgeProps {
  type: BadgeType;
  title: string;
  description: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

const AchievementBadge = ({
  type,
  title,
  description,
  earned,
  progress = 0,
  maxProgress = 1
}: AchievementBadgeProps) => {
  const badgeColors = {
    bronze: "bg-badge-bronze",
    silver: "bg-badge-silver",
    gold: "bg-badge-gold",
    platinum: "bg-badge-platinum"
  };

  const progressPercentage = Math.min(100, Math.round((progress / maxProgress) * 100));

  return (
    <div className={`border rounded-lg p-4 ${earned ? "bg-accent" : "bg-card opacity-70"} transition-all hover:shadow-md`}>
      <div className="flex items-start space-x-4">
        <div className={`achievement-badge ${badgeColors[type]} ${earned ? "animate-bounce-small" : ""}`}>
          {earned ? (
            <Check className="h-6 w-6" />
          ) : (
            <span className="text-sm font-bold">{progressPercentage}%</span>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {!earned && maxProgress > 1 && (
            <div className="mt-2">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progressPercentage}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress} / {maxProgress} completed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;

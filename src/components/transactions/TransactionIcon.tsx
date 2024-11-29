import React from 'react';
import { 
  ShoppingBag, 
  Home, 
  Car, 
  Utensils, 
  Tv, 
  Zap, 
  TrendingUp, 
  LucideIcon,
  LucideProps
} from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  Housing: Home,
  Food: Utensils,
  Transport: Car,
  Utilities: Zap,
  Entertainment: Tv,
  Shopping: ShoppingBag,
  Income: TrendingUp,
};

interface TransactionIconProps extends LucideProps {
  category: string;
}

export default function TransactionIcon({ category, ...props }: TransactionIconProps) {
  const Icon = categoryIcons[category] || ShoppingBag;
  return <Icon {...props} />;
}
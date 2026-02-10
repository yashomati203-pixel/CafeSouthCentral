import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Badge } from './Badge';
import { Plus } from 'lucide-react';

// --- Menu Card ---

interface MenuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  isVeg?: boolean;
  lowStock?: boolean;
  onAdd?: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  imageSrc,
  title,
  description,
  price,
  category,
  isVeg,
  lowStock,
  onAdd,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "group relative bg-pure-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-palm-green-light/30 transition-all duration-300 cursor-pointer overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Veg/Non-Veg Indicator */}
        {isVeg !== undefined && (
          <div className={cn(
            "absolute top-3 left-3 w-5 h-5 bg-white/90 backdrop-blur-sm rounded-md border-2 flex items-center justify-center",
            isVeg ? "border-success" : "border-error"
          )}>
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              isVeg ? "bg-success" : "bg-error"
            )} />
          </div>
        )}

        {/* Low Stock Badge */}
        {lowStock && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="warning" className="shadow-md">Only a few left</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        {category && (
          <span className="text-xs font-bold uppercase tracking-wider text-palm-green-light">
            {category}
          </span>
        )}
        
        <h3 className="font-serif-display text-xl font-semibold text-gray-700 leading-tight">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="font-mono text-xl font-bold text-palm-green-dark">
            ₹{price}
          </span>
          <Button 
            variant="primary" 
            size="small" 
            className="px-4 py-1.5 h-9 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
          >
           <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Order Card ---

interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  orderId: string;
  date: string;
  status: 'Completed' | 'Preparing' | 'Ready' | 'Cancelled';
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  onReorder?: () => void;
  onViewDetails?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  date,
  status,
  total,
  items,
  onReorder,
  onViewDetails,
  className,
  ...props
}) => {
  const statusVariant = {
    'Completed': 'success',
    'Preparing': 'info',
    'Ready': 'success',
    'Cancelled': 'error',
  } as const;

  return (
    <div 
      className={cn(
        "bg-pure-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-palm-green-light/50 hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="block font-mono text-sm font-bold text-gray-700">{orderId}</span>
          <span className="block text-sm text-gray-400 mt-1">{date}</span>
        </div>
        <Badge variant={statusVariant[status] || 'neutral'}>{status}</Badge>
      </div>

      {/* Items Summary (First 2 + 'more') */}
      <div className="flex flex-col gap-2 py-3 border-y border-gray-100">
        {items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-600">
            <span>{item.quantity}x {item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
        {items.length > 2 && (
          <span className="text-xs text-gray-400 italic">
            + {items.length - 2} more items...
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500 block">Total</span>
          <span className="font-mono text-lg font-bold text-palm-green-dark">₹{total}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="small" onClick={onViewDetails} className="h-9 px-4">
            Details
          </Button>
          <Button variant="secondary" size="small" onClick={onReorder} className="h-9 px-4">
            Reorder
          </Button>
        </div>
      </div>
    </div>
  );
};

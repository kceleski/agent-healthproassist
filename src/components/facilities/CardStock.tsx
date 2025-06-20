// src/components/facilities/CardStack.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Bed, Users, DollarSign } from "lucide-react"
import ColorThief from "colorthief"
import { supabase } from "@/lib/supabase" // Import Supabase client

// This interface now matches our agent_facilities table
interface CardData {
  id: string
  name: string
  description: string | null
  image_url: string | null
  type: string | null
  // We'll add the colors property dynamically
  colors?: {
    primary: string
    secondary: string
    text: string
    shadow: string
  }
}

// Map database types to an icon name
const typeToIconMap: { [key: string]: string } = {
    "Assisted Living & Memory Care": "bed",
    "Assisted Living Community": "bed",
    "Skilled Nursing Facility": "bed",
    "Veteran Contracted Facility": "users",
    "Hospice": "users",
    "Home Health": "arrowUpRight"
};


export default function CardStack() {
  const [cards, setCards] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchAndProcessFacilities = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('agent_facilities').select('*').limit(10);

      if (error) {
        console.error("Error fetching facilities:", error);
        setLoading(false);
        return;
      }

      const colorThief = new ColorThief();
      const processedCards = await Promise.all(
        data.map(async (facility) => {
          let colors = { primary: "#1a3a5f", secondary: "#2d5f8a", text: "#ffffff", shadow: "rgba(26, 58, 95, 0.6)"}; // Default colors
          if (facility.image_url) {
            try {
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = facility.image_url;
              await img.decode();
              const palette = colorThief.getPalette(img, 3);
              const primaryColor = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
              const secondaryColor = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`;
              const shadowColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.6)`;
              const brightness = (palette[0][0] * 299 + palette[0][1] * 587 + palette[0][2] * 114) / 1000;
              const textColor = brightness < 128 ? "#ffffff" : "#000000";
              colors = { primary: primaryColor, secondary: secondaryColor, text: textColor, shadow: shadowColor };
            } catch (e) {
              console.error("Could not process image for color extraction:", facility.image_url, e);
            }
          }
          return { ...facility, colors };
        })
      );
      
      setCards(processedCards);
      setLoading(false);
    }
    fetchAndProcessFacilities();
  }, [])


  const removeCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    // In a real app, you might fetch a new card from the database here
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "bed": return <Bed className="h-5 w-5" />
      case "users": return <Users className="h-5 w-5" />
      case "dollar": return <DollarSign className="h-5 w-5" />
      default: return <ArrowUpRight className="h-5 w-5" />
    }
  }

  if (loading) {
    return <div className="flex h-[600px] w-full items-center justify-center text-muted-foreground">Loading facility cards...</div>
  }

  return (
    <div className="relative h-[600px] w-full">
      <AnimatePresence>
        {cards.slice(0, 5).map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            removeCard={removeCard}
            getIconComponent={getIconComponent}
            totalCards={Math.min(cards.length, 5)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// The individual Card component remains the same as in your provided code
// Ensure it's in the same file or imported correctly
interface CardProps {
  card: CardData
  index: number
  removeCard: (id: string) => void
  getIconComponent: (iconName: string) => JSX.Element
  totalCards: number
}

function Card({ card, index, removeCard, getIconComponent, totalCards }: CardProps) {
    // ... Paste the exact Card component code you provided here ...
    // Make sure to update props from (id: number) to (id: string) in removeCard
}

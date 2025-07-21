

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {LucideIcon } from "lucide-react";
import React from "react";

interface FeedbackCardProps {
  icon:LucideIcon;
  title: string;
  message: string;
  href: string;
  buttonText: string;
  bgColor?: string;
}

export default function FeedbackCard({
  icon,
  title,
  message,
  href,
  buttonText,
  bgColor = "bg-gray-100",
}: FeedbackCardProps) {
  const IconComponent = icon;
  return (
    <div className= "bg-gray-50/30 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center py-12">
          <div
            className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-4`}
          >
            <IconComponent />
          </div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground text-center mb-6">{message}</p>
          <Link href={href}>
            <Button>{buttonText}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

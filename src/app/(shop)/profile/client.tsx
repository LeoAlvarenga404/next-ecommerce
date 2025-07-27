"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IUserData } from "@/@types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Edit3, Save, X, LogIn } from "lucide-react";
import { Logout } from "@/components/custom/logout";
import { userService } from "@/services/user";

interface ProfileClientProps {
  userData: IUserData | null;
}

export default function ProfileClient({ userData }: ProfileClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Acesso Necessário</CardTitle>
            <CardDescription>
              Você precisa estar logado para visualizar seus dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/login")}>
              <LogIn className="w-4 h-4 mr-2" />
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    await userService.updateUser({
      user_id: userData?.user_id || "",
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
    });
    router.refresh();

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </div>
              <Logout />
            </CardTitle>
            <CardDescription>
              Suas informações básicas de cadastro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData?.name || ""}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{userData.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData?.email || ""}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev ? { ...prev, email: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{userData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editData?.phone || ""}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null
                      )
                    }
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{userData.phone || "Não informado"}</span>
                    {!userData.phone && (
                      <Badge variant="secondary" className="text-xs">
                        Não cadastrado
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

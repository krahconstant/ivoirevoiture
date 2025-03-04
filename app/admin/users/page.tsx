import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, User, UserCog } from "lucide-react"

export default async function AdminUsersPage() {
  const session = await getSession()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h2>
          <p className="text-muted-foreground">Consultez et gérez les comptes utilisateurs</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un utilisateur..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <UserCog className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <Badge variant={user.role === "ADMIN" ? "destructive" : "default"} className="ml-2">
                        {user.role === "ADMIN" ? "Admin" : "Client"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Inscrit le {format(new Date(user.createdAt), "PPP", { locale: fr })}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/admin/users/${user.id}`}>Voir le profil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}


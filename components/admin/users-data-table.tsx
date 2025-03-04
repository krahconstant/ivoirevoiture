"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { Role } from "@prisma/client"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  createdAt: Date
  _count: {
    reservations: number
  }
}

interface DataTableProps {
  data: User[]
}

export function UsersDataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher par nom ou email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Réservations</TableHead>
              <TableHead>Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user._count.reservations}</TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


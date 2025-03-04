"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Calendar, User, Car, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"
import { ReservationStatus, type Reservation } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Fonction pour mettre à jour le statut d'une réservation
async function updateReservationStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Erreur lors de la mise à jour du statut")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur:", error)
    throw error
  }
}

// Fonction pour formater les dates de manière sécurisée
function safeFormatDate(date: Date | string, formatString: string) {
  try {
    return format(new Date(date), formatString, { locale: fr })
  } catch (error) {
    console.error("Erreur de formatage de date:", error)
    return "Date invalide"
  }
}

// Définition des colonnes
export const columns: ColumnDef<Reservation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="truncate max-w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "vehicle",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Véhicule
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as Reservation["vehicle"]
      if (!vehicle) return <span className="text-muted-foreground">Non disponible</span>
      return (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span>
            {vehicle.brand} {vehicle.model}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "user",
    header: "Client",
    cell: ({ row }) => {
      const user = row.getValue("user") as Reservation["user"]
      if (!user) return <span className="text-muted-foreground">Non disponible</span>
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{user.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "dates",
    header: "Dates",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{safeFormatDate(row.original.startDate, "dd/MM/yyyy")}</span>
          </div>
          <span className="text-xs text-muted-foreground">au {safeFormatDate(row.original.endDate, "dd/MM/yyyy")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalPrice") as string)
      return <div className="font-medium">{formatPrice(amount)}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "CONFIRMED" ? "success" : status === "CANCELLED" ? "destructive" : "default"}>
          {status === "PENDING" ? "En attente" : status === "CONFIRMED" ? "Confirmée" : "Annulée"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date de création
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{safeFormatDate(row.getValue("createdAt"), "dd/MM/yyyy HH:mm")}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const reservation = row.original
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
      const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
      const [isLoading, setIsLoading] = useState(false)
      const { toast } = useToast()

      const handleConfirm = async () => {
        setIsLoading(true)
        try {
          await updateReservationStatus(reservation.id, ReservationStatus.CONFIRMED)
          toast({
            title: "Réservation confirmée",
            description: "La réservation a été confirmée avec succès.",
          })
          // Rafraîchir la page pour mettre à jour les données
          window.location.reload()
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la confirmation.",
          })
          console.error("Erreur de confirmation:", error)
        } finally {
          setIsLoading(false)
          setIsConfirmDialogOpen(false)
        }
      }

      const handleCancel = async () => {
        setIsLoading(true)
        try {
          await updateReservationStatus(reservation.id, ReservationStatus.CANCELLED)
          toast({
            title: "Réservation annulée",
            description: "La réservation a été annulée avec succès.",
          })
          // Rafraîchir la page pour mettre à jour les données
          window.location.reload()
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de l'annulation.",
          })
          console.error("Erreur d'annulation:", error)
        } finally {
          setIsLoading(false)
          setIsCancelDialogOpen(false)
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => (window.location.href = `/admin/reservations/${reservation.id}`)}>
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {reservation.status === "PENDING" && (
                <>
                  <DropdownMenuItem onClick={() => setIsConfirmDialogOpen(true)}>Confirmer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCancelDialogOpen(true)}>Annuler</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog de confirmation */}
          <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la réservation</DialogTitle>
                <DialogDescription>Êtes-vous sûr de vouloir confirmer cette réservation ?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleConfirm} disabled={isLoading}>
                  {isLoading ? "Confirmation..." : "Confirmer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog d'annulation */}
          <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Annuler la réservation</DialogTitle>
                <DialogDescription>Êtes-vous sûr de vouloir annuler cette réservation ?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                  Retour
                </Button>
                <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
                  {isLoading ? "Annulation..." : "Annuler la réservation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]

export function ReservationsDataTable({ data }: { data: Reservation[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [filterType, setFilterType] = useState("all")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const itemValue = row.getValue(columnId) as string
        return itemValue.toLowerCase().includes(value.toLowerCase())
      },
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = filterValue.toLowerCase()

      // Filter by ID
      if (filterType === "id" && columnId === "id") {
        const id = row.getValue(columnId) as string
        return id.toLowerCase().includes(value)
      }

      // Filter by vehicle (brand or model)
      if (filterType === "vehicle" && columnId === "vehicle") {
        const vehicle = row.getValue(columnId) as Reservation["vehicle"]
        if (!vehicle) return false
        const vehicleText = `${vehicle.brand} ${vehicle.model}`.toLowerCase()
        return vehicleText.includes(value)
      }

      // Filter by customer name
      if (filterType === "customer" && columnId === "user") {
        const user = row.getValue(columnId) as Reservation["user"]
        if (!user) return false
        return user.name.toLowerCase().includes(value)
      }

      // All columns (default)
      if (filterType === "all") {
        if (columnId === "id") {
          const id = row.getValue(columnId) as string
          return id.toLowerCase().includes(value)
        }

        if (columnId === "vehicle") {
          const vehicle = row.getValue(columnId) as Reservation["vehicle"]
          if (!vehicle) return false
          const vehicleText = `${vehicle.brand} ${vehicle.model}`.toLowerCase()
          return vehicleText.includes(value)
        }

        if (columnId === "user") {
          const user = row.getValue(columnId) as Reservation["user"]
          if (!user) return false
          return user.name.toLowerCase().includes(value)
        }
      }

      return false
    },
  })

  // Apply global filter to relevant columns based on filter type
  useEffect(() => {
    table.setGlobalFilter(globalFilter)
  }, [globalFilter, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                onClick={() => setGlobalFilter("")}
                className="absolute right-0 top-0 h-full px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les champs</SelectItem>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="vehicle">Véhicule</SelectItem>
              <SelectItem value="customer">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "vehicle"
                        ? "Véhicule"
                        : column.id === "user"
                          ? "Client"
                          : column.id === "dates"
                            ? "Dates"
                            : column.id === "totalPrice"
                              ? "Prix"
                              : column.id === "status"
                                ? "Statut"
                                : column.id === "createdAt"
                                  ? "Date de création"
                                  : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune réservation trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
          sélectionnée(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}


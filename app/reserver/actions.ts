"use server"

import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ReservationStatus } from "@/lib/types"
import { sendNotification } from "@/lib/sse"

export async function createReservation(formData: FormData) {
  console.log("Début de la fonction createReservation")

  try {
    const session = await getSession()

    if (!session?.user) {
      console.error("Erreur d'authentification: Aucune session utilisateur")
      return { error: "Non autorisé" }
    }

    console.log("Session utilisateur valide:", session.user.id)

    // Récupérer et valider les données du formulaire
    const vehicleId = formData.get("vehicleId") as string
    const startDateStr = formData.get("startDate") as string
    const endDateStr = formData.get("endDate") as string
    const customerName = formData.get("name") as string
    const customerEmail = formData.get("email") as string
    const customerPhone = formData.get("phone") as string
    const totalPriceStr = formData.get("totalPrice") as string

    console.log("Données du formulaire reçues:", {
      vehicleId,
      startDateStr,
      endDateStr,
      customerName,
      customerEmail,
      customerPhone,
      totalPriceStr,
    })

    // Validation des données
    if (!vehicleId || !startDateStr || !endDateStr || !customerName || !customerEmail || !customerPhone) {
      console.error("Validation échouée: Champs obligatoires manquants")
      return { error: "Veuillez remplir tous les champs obligatoires" }
    }

    // Conversion des dates et du prix
    let startDate: Date, endDate: Date, totalPrice: number

    try {
      startDate = new Date(startDateStr)
      endDate = new Date(endDateStr)
      totalPrice = totalPriceStr ? Number.parseFloat(totalPriceStr) : 0

      // Vérifier que les dates sont valides
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Dates invalides")
      }

      // Vérifier que le prix est valide
      if (isNaN(totalPrice) || totalPrice <= 0) {
        throw new Error("Prix invalide")
      }
    } catch (error) {
      console.error("Erreur de conversion des données:", error)
      return { error: "Format de données invalide" }
    }

    console.log("Dates validées et converties:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
    })

    // Vérifier si le véhicule existe
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: {
        id: true,
        brand: true,
        model: true,
        dailyRate: true,
      },
    })

    if (!vehicle) {
      console.error("Véhicule non trouvé:", vehicleId)
      return { error: "Véhicule non trouvé" }
    }

    console.log("Véhicule trouvé:", vehicle)

    // Calculer le nombre de jours et le prix total
    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Si le prix total n'est pas fourni, le calculer
    if (totalPrice <= 0) {
      totalPrice = numberOfDays * (vehicle.dailyRate || 0)
    }

    console.log("Calcul du prix:", {
      numberOfDays,
      dailyRate: vehicle.dailyRate,
      totalPrice,
    })

    // Vérifier la disponibilité - MODIFIÉ POUR DÉBOGUER
    console.log("Vérification de la disponibilité pour les dates:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      vehicleId,
    })

    // Récupérer toutes les réservations existantes pour ce véhicule
    const existingReservations = await prisma.reservation.findMany({
      where: {
        vehicleId,
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED],
        },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    })

    console.log(
      `Trouvé ${existingReservations.length} réservation(s) existante(s) pour ce véhicule:`,
      existingReservations.map((r) => ({
        id: r.id,
        startDate: r.startDate.toISOString(),
        endDate: r.endDate.toISOString(),
        status: r.status,
      })),
    )

    // Vérifier manuellement les chevauchements
    let conflictingReservation = null
    for (const reservation of existingReservations) {
      // Vérifier si les dates se chevauchent
      const overlap =
        (startDate <= reservation.endDate && startDate >= reservation.startDate) || // La date de début est dans une réservation existante
        (endDate <= reservation.endDate && endDate >= reservation.startDate) || // La date de fin est dans une réservation existante
        (startDate <= reservation.startDate && endDate >= reservation.endDate) // La réservation existante est entièrement contenue dans les nouvelles dates

      if (overlap) {
        conflictingReservation = reservation
        break
      }
    }

    if (conflictingReservation) {
      console.error("Conflit de réservation détecté:", {
        conflictingId: conflictingReservation.id,
        conflictingStart: conflictingReservation.startDate.toISOString(),
        conflictingEnd: conflictingReservation.endDate.toISOString(),
        requestedStart: startDate.toISOString(),
        requestedEnd: endDate.toISOString(),
      })

      // Formater les dates pour l'affichage
      const formatDate = (date: Date) => {
        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      }

      return {
        error: `Ces dates ne sont pas disponibles. Il existe déjà une réservation du ${formatDate(conflictingReservation.startDate)} au ${formatDate(conflictingReservation.endDate)}.`,
        conflictDetails: {
          conflictingId: conflictingReservation.id,
          conflictingStart: conflictingReservation.startDate,
          conflictingEnd: conflictingReservation.endDate,
        },
      }
    }

    console.log("Aucun conflit de réservation trouvé, création de la réservation...")

    // Créer la réservation avec try/catch spécifique
    let reservation
    try {
      reservation = await prisma.reservation.create({
        data: {
          startDate,
          endDate,
          totalPrice,
          status: ReservationStatus.PENDING,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          userId: session.user.id,
          vehicleId,
        },
        include: {
          vehicle: {
            select: {
              brand: true,
              model: true,
            },
          },
        },
      })

      console.log("Réservation créée avec succès:", reservation.id)
    } catch (dbError) {
      console.error("Erreur Prisma lors de la création de la réservation:", dbError)
      return {
        error: "Erreur lors de la création de la réservation dans la base de données",
        details: String(dbError),
      }
    }

    // Envoyer une notification aux administrateurs
    try {
      console.log("Envoi de la notification de nouvelle réservation...")
      const notificationResult = await sendNotification("NEW_RESERVATION", {
        id: reservation.id,
        vehicle: reservation.vehicle,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        dates: {
          start: startDate,
          end: endDate,
        },
        totalPrice,
      })

      console.log("Résultat de l'envoi de notification:", notificationResult)
    } catch (notificationError) {
      console.error("Erreur lors de l'envoi de la notification:", notificationError)
      // Ne pas échouer la création de réservation si la notification échoue
    }

    // Revalider les chemins
    revalidatePath("/reserver")
    revalidatePath("/dashboard/reservations")
    revalidatePath(`/reservations/${reservation.id}`)

    // Assurez-vous de retourner l'ID de réservation
    return {
      success: true,
      reservationId: reservation.id,
    }
  } catch (error) {
    console.error("Erreur générale lors de la création de la réservation:", error)
    return {
      error: "Une erreur est survenue lors de la création de la réservation",
      details: String(error),
    }
  }
}


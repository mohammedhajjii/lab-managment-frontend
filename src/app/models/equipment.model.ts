

export interface Category{
  readonly id: number;
  name: string;
}

export enum EquipmentStatus {
  /**
   * the equipment is ready to use
   */
  AVAILABLE = 'AVAILABLE',
  /**
   * if the equipment is no longer available due to operational issues
   */
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  /**
   * if the equipment is no longer exists or available in lab
   */
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export interface Equipment{
  readonly id?: string;
  readonly qrcode?: string;
  name: string;
  restricted: boolean;
  image?: string | Blob;
  status?: EquipmentStatus;
  category?: Category;
  categoryId?: number;
}


export enum ReservationStatus {
  /**
   * if the equipment is restricted, then the user need the authorization from prof
   */
  WAITLISTED = 'WAITLISTED',
  /**
   * if the equipment is not restricted, accepted and pending, waiting to check out
   */
  ACCEPTED = 'ACCEPTED',
  /**
   * if the reservation is refused by prof
   */
  REFUSED = 'REFUSED',
  /**
   * equipment is in use, and user take possession of the equipment (reservation started)
   */
  CHECKED_OUT = 'CHECKED_OUT',
  /**
   *  the reservation ended, and user return the equipment
   */
  COMPLETED = 'COMPLETED',
  /**
   * if the user or request for canceling a reservation
   */
  CANCEL_REQUESTED = 'CANCEL_REQUESTED',
  /**
   * if the admin or prof cancel a reservation due to damage or operational issues
   */
  CANCELLED = 'CANCELLED',
  /**
   * if the allocated time is out
   */
  EXPIRED = 'EXPIRED'
}

export enum ReservationPriority {
  /**
   * if the reservation made by prof
   */
  HIGH,
  /**
   * if the reservation made by STUDENT
   */
  MEDIUM,
  /**
   * if the reservation made by Guest
   */
  LOW
}

export interface ReservedEquipment{
  id: string;
  name: string;
  image: string;
  qrcode: string;
}

export interface EquipmentReservationDTO {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: ReservationPriority;
  description: string;
}

export interface EquipmentReservationRequestDTO extends EquipmentReservationDTO{
  equipmentId: string;
}

export interface EquipmentReservationResponseDTO extends EquipmentReservationDTO{
  id: string;
  status: ReservationStatus;
  equipment: ReservedEquipment;
}

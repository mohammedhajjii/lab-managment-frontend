

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

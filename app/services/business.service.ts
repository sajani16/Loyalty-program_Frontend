import api from "@/lib/api";
import { ApiResponse } from "./auth.service";

export interface BusinessDetail {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
  isVerified: boolean;
}

export const businessService = {
  /**
   * Get business QR code (businessId as the QR data)
   * QR contains only businessId
   */
  async getBusinessQRData(businessId: string): Promise<{ businessId: string }> {
    // This generates the QR code data locally
    // Backend validates businessId exists but QR is just plain businessId
    return { businessId };
  },

  /**
   * Generate QR code as image (frontend generates, can integrate with third-party QR service)
   */
  async generateQRCodeImage(businessId: string): Promise<string> {
    // Can use qrcode.react library or external API
    // For now, return the businessId that will be used to generate QR
    return businessId;
  },

  /**
   * Generate shareable link with business QR (download link)
   */
  async generateQRDownloadLink(businessId: string): Promise<string> {
    // Generate a downloadable QR code
    // Frontend will handle QR generation and download
    return `/api/qr/download/${businessId}`;
  },
};

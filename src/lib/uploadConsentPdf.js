import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfllse3az',
  api_key: process.env.CLOUDINARY_API_KEY || '999646942898938',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZPTfioQjEGd-KeWpi-6cWZm2XrQ',
})

/**
 * Upload a PDF buffer to Cloudinary (private storage for health data)
 * @param {Buffer} buffer - PDF file buffer
 * @param {string} publicId - Cloudinary public ID (e.g. 'nuelo/etherealsmile/consent/records/record-3')
 * @returns {Promise<{url: string, publicId: string, signedUrl: string}>}
 */
export async function uploadConsentPdf(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: publicId,
        folder: 'nuelo/etherealsmile/consent/records',
        format: 'pdf',
        type: 'upload',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(error)
        } else {
          // Generate a signed download URL (valid 1 hour) for admin access
          // Raw files are not publicly servable on this Cloudinary account (correct for health data)
          const signedUrl = cloudinary.utils.private_download_url(result.public_id, 'pdf', {
            resource_type: 'raw',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          })
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            signedUrl: signedUrl,
          })
        }
      }
    )

    uploadStream.end(buffer)
  })
}

/**
 * Generate a time-limited signed download URL for a consent PDF
 * @param {string} publicId - Cloudinary public ID
 * @param {number} expiresInSeconds - URL validity in seconds (default: 3600 = 1 hour)
 * @returns {string} Signed download URL
 */
export function getConsentPdfSignedUrl(publicId, expiresInSeconds = 3600) {
  return cloudinary.utils.private_download_url(publicId, 'pdf', {
    resource_type: 'raw',
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })
}
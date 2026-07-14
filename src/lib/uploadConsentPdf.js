import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfllse3az',
  api_key: process.env.CLOUDINARY_API_KEY || '999646942898938',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZPTfioQjEGd-KeWpi-6cWZm2XrQ',
})

/**
 * Upload a PDF buffer to Cloudinary
 * @param {Buffer} buffer - PDF file buffer
 * @param {string} publicId - Cloudinary public ID (e.g. 'nuelo/etherealsmile/consent/records/record-3')
 * @returns {Promise<{url: string, publicId: string}>}
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
        access_mode: 'public',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          reject(error)
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        }
      }
    )

    uploadStream.end(buffer)
  })
}
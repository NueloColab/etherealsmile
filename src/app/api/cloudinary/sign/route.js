import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfllse3az',
  api_key: process.env.CLOUDINARY_API_KEY || '999646942898938',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZPTfioQjEGd-KeWpi-6cWZm2XrQ',
})

export async function POST(req) {
  try {
    const { folder = 'general', resourceType = 'auto' } = await req.json()

    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = {
      timestamp,
      folder: `nuelo/etherealsmile/${folder}`,
      ...(resourceType !== 'auto' ? { resource_type: resourceType } : {}),
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret)

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name,
      folder: paramsToSign.folder,
      resourceType,
    })
  } catch (error) {
    console.error('Cloudinary sign error:', error)
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const activities = await Activity.find().sort({ date: -1, order: 1 });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const formData = await req.formData();

    const date = formData.get('date');
    const type = formData.get('type') || 'EVENT';
    const featured = formData.get('featured') === 'true';
    const order = formData.get('order') || 0;

    // Parse bilingual fields
    let title, description, content;
    try { title = JSON.parse(formData.get('title')); } catch { title = formData.get('title'); }
    try { description = JSON.parse(formData.get('description')); } catch { description = formData.get('description'); }
    try { content = JSON.parse(formData.get('content')); } catch { content = formData.get('content'); }

    // Handle thumbnail upload
    let thumbnail = '';
    const thumbnailFile = formData.get('thumbnailFile');
    if (thumbnailFile && typeof thumbnailFile === 'object' && thumbnailFile.name) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'portfolio/activities/thumbnails' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });
      thumbnail = uploadResult.secure_url;
    }

    // Handle multiple images
    const images = [];
    const imageFiles = formData.getAll('images');
    for (const file of imageFiles) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'portfolio/activities' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });
        images.push(uploadResult.secure_url);
      }
    }

    const activity = await Activity.create({
      title,
      date,
      type,
      description,
      content,
      thumbnail,
      images,
      featured,
      order,
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

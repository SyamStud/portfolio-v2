import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
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
    
    const demoUrl = formData.get('demoUrl');
    const repoUrl = formData.get('repoUrl');
    const order = formData.get('order') || 0;
    const proprietary = formData.get('proprietary') === 'true';
    const youtubeUrl = formData.get('youtubeUrl') || '';

    // Parse bilingual fields
    let title, description, content;
    try { title = JSON.parse(formData.get('title')); } catch { title = formData.get('title'); }
    try { description = JSON.parse(formData.get('description')); } catch { description = formData.get('description'); }
    try { content = JSON.parse(formData.get('content')); } catch { content = formData.get('content'); }
    
    let videoUrl = '';
    const videoFile = formData.get('videoFile');
    if (videoFile && typeof videoFile === 'object' && videoFile.name) {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects/videos', resource_type: 'video' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      videoUrl = uploadResult.secure_url;
    }
    
    // Handle thumbnail upload
    let thumbnail = '';
    const thumbnailFile = formData.get('thumbnailFile');
    if (thumbnailFile && typeof thumbnailFile === 'object' && thumbnailFile.name) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'portfolio/projects/thumbnails' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });
      thumbnail = uploadResult.secure_url;
    }

    const images = [];
    const imageFiles = formData.getAll('images');
    for (const file of imageFiles) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'portfolio/projects' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });
        images.push(uploadResult.secure_url);
      }
    }

    // Process tech stack (logos are now URLs, not files)
    const techStack = parseTechStackData(formData);

    const project = await Project.create({
      title, description, content, demoUrl, repoUrl, order, proprietary, thumbnail, images, techStack, youtubeUrl, videoUrl
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function parseTechStackData(formData) {
  const techStackDataStr = formData.get('techStackData');
  if (!techStackDataStr) return [];

  try {
    const techStackData = JSON.parse(techStackDataStr);
    return techStackData
      .filter(item => item.name)
      .map(item => ({ name: item.name, logo: item.logo || '' }));
  } catch {
    return [];
  }
}

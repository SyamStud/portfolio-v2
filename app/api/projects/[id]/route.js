import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const formData = await req.formData();
    
    // Parse bilingual fields
    let title, description, content;
    try { title = JSON.parse(formData.get('title')); } catch { title = formData.get('title'); }
    try { description = JSON.parse(formData.get('description')); } catch { description = formData.get('description'); }
    try { content = JSON.parse(formData.get('content')); } catch { content = formData.get('content'); }

    const updateData = {
      title,
      description,
      content,
      demoUrl: formData.get('demoUrl'),
      repoUrl: formData.get('repoUrl'),
      order: formData.get('order') || 0,
      proprietary: formData.get('proprietary') === 'true',
      youtubeUrl: formData.get('youtubeUrl') || '',
    };

    if (formData.get('removeVideo') === 'true') {
      updateData.videoUrl = '';
    }

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
      updateData.videoUrl = uploadResult.secure_url;
    }

    // Handle thumbnail
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
      updateData.thumbnail = uploadResult.secure_url;
    } else {
      const existingThumbnail = formData.get('existingThumbnail');
      if (existingThumbnail) {
        updateData.thumbnail = existingThumbnail;
      } else {
        updateData.thumbnail = '';
      }
    }

    // Keep existing images passed from client (supports JSON array for ordered drag & drop)
    let existingImages = [];
    const existingImagesJson = formData.get('existingImagesJson');
    if (existingImagesJson) {
      try { existingImages = JSON.parse(existingImagesJson); } catch { existingImages = []; }
    } else {
      existingImages = formData.getAll('existingImages') || [];
    }
    const newImageFiles = formData.getAll('images');
    const uploadedImages = [];
    
    for (const file of newImageFiles) {
      if (file && typeof file === 'object' && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'portfolio/projects' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });
        uploadedImages.push(uploadResult.secure_url);
      }
    }

    updateData.images = [...existingImages, ...uploadedImages];

    // Process tech stack (logos are URLs now)
    updateData.techStack = parseTechStackData(formData);

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
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

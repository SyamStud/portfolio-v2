import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne();
    return NextResponse.json(profile || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    const contentType = req.headers.get('content-type') || '';
    let dataToSave = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      dataToSave = {
        name: formData.get('name'),
        email: formData.get('email') || '',
        github: formData.get('github') || '',
        linkedin: formData.get('linkedin') || '',
        resumeLink: formData.get('resumeLink') || '',
      };

      // Parse bilingual fields (sent as JSON strings)
      const titleRaw = formData.get('title');
      try { dataToSave.title = JSON.parse(titleRaw); } catch { dataToSave.title = titleRaw; }

      const bioRaw = formData.get('bio');
      try { dataToSave.bio = JSON.parse(bioRaw); } catch { dataToSave.bio = bioRaw; }
      
      const skillsData = formData.get('skills');
      if (skillsData) {
        try {
          dataToSave.skills = JSON.parse(skillsData);
        } catch {
          dataToSave.skills = [];
        }
      }

      const imageFile = formData.get('image');
      if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'portfolio/profile' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });
        dataToSave.image = uploadResult.secure_url;
      } else {
        const existingImage = formData.get('existingImage');
        if (existingImage) dataToSave.image = existingImage;
        else dataToSave.image = '';
      }
    } else {
      dataToSave = await req.json();
    }
    
    // We only want ONE profile in the DB for the portfolio
    let profile = await Profile.findOne();
    if (profile) {
      profile.set(dataToSave);
      await profile.save();
    } else {
      profile = await Profile.create(dataToSave);
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


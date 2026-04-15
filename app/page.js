import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Experience from '@/models/Experience';
import Project from '@/models/Project';
import Activity from '@/models/Activity';
import Tech from '@/models/Tech';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

async function getData() {
  await connectToDatabase();

  const [profile, experiences, projects, activities, techs] = await Promise.all([
    Profile.findOne().lean(),
    Experience.find().sort({ startDate: -1 }).lean(),
    Project.find().sort({ order: 1, createdAt: -1 }).lean(),
    Activity.find().sort({ date: -1, order: 1 }).lean(),
    Tech.find().sort({ order: 1, createdAt: 1 }).lean(),
  ]);

  return {
    profile: profile ? JSON.parse(JSON.stringify(profile)) : {
      name: 'Your Name',
      title: { en: 'Your Job Title', id: 'Jabatan Anda' },
      bio: { en: 'Your biography goes here.', id: 'Biografi Anda di sini.' },
    },
    experiences: JSON.parse(JSON.stringify(experiences)),
    projects: JSON.parse(JSON.stringify(projects)),
    activities: JSON.parse(JSON.stringify(activities)),
    techs: JSON.parse(JSON.stringify(techs)),
  };
}

export default async function Home() {
  const data = await getData();
  return <HomeClient {...data} />;
}
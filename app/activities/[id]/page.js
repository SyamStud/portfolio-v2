import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getLocalized } from '@/lib/localize';
import ActivityDetailClient from './ActivityDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const activity = await Activity.findById(id).lean();
  const title = activity ? getLocalized(activity.title, 'en') : 'Activity Not Found';
  return {
    title: `${title} - Portfolio`,
  };
}

export default async function ActivityDetailPage({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const activityDoc = await Activity.findById(id).lean();
  const activity = activityDoc ? JSON.parse(JSON.stringify(activityDoc)) : null;

  return <ActivityDetailClient activity={activity} />;
}

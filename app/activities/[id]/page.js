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

  // Fetch current activity and all activities for next/prev navigation
  const [activityDoc, allActivitiesDocs] = await Promise.all([
    Activity.findById(id).lean(),
    Activity.find().sort({ date: -1, order: 1 }).select('_id title').lean(),
  ]);

  const activity = activityDoc ? JSON.parse(JSON.stringify(activityDoc)) : null;
  const allActivities = JSON.parse(JSON.stringify(allActivitiesDocs));

  // Find current index and determine prev/next
  const currentIdx = allActivities.findIndex(a => a._id === id);
  const prevActivity = currentIdx > 0 ? allActivities[currentIdx - 1] : allActivities[allActivities.length - 1];
  const nextActivity = currentIdx < allActivities.length - 1 ? allActivities[currentIdx + 1] : allActivities[0];

  return (
    <ActivityDetailClient
      activity={activity}
      prevActivity={prevActivity}
      nextActivity={nextActivity}
    />
  );
}

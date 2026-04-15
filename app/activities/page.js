import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import ActivitiesListClient from './ActivitiesListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Activities - Portfolio',
};

export default async function ActivitiesPage() {
  await connectToDatabase();
  const activities = await Activity.find().sort({ date: -1, order: 1 }).lean();
  const activitiesList = activities.map(doc => ({ ...doc, _id: doc._id.toString() }));

  return <ActivitiesListClient activities={JSON.parse(JSON.stringify(activitiesList))} />;
}

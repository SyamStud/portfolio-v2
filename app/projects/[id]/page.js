import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getLocalized } from '@/lib/localize';
import ProjectDetailClient from './ProjectDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const project = await Project.findById(id).lean();
  const title = project ? getLocalized(project.title, 'en') : 'Project Not Found';
  return {
    title: `${title} - Portfolio`,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const projectDoc = await Project.findById(id).lean();
  const project = projectDoc ? JSON.parse(JSON.stringify(projectDoc)) : null;

  return <ProjectDetailClient project={project} />;
}
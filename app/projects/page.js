import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectsListClient from './ProjectsListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Projects',
  description: 'Browse all projects and case studies.',
};

async function getProjects() {
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsListClient projects={projects} />;
}

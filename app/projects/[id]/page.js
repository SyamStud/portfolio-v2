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

  // Fetch current project and all projects for next/prev navigation
  const [projectDoc, allProjectsDocs] = await Promise.all([
    Project.findById(id).lean(),
    Project.find().sort({ order: 1, createdAt: -1 }).select('_id title').lean(),
  ]);

  const project = projectDoc ? JSON.parse(JSON.stringify(projectDoc)) : null;
  const allProjects = JSON.parse(JSON.stringify(allProjectsDocs));

  // Find current index and determine prev/next
  const currentIdx = allProjects.findIndex(p => p._id === id);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : allProjects[0];

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
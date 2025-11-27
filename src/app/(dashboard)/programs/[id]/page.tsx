import { redirect } from 'next/navigation';

interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { id } = await params;
  // Redirect to edit page - in this app, viewing a program means editing it
  redirect(`/programs/${id}/edit`);
}

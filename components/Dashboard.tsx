import Link from 'next/link';
import { Card, Grid, Text } from '@tremor/react';

import { LoginButton } from './LoginButton';
import { CVCard } from './CVCard';
import { PlusIcon } from '@heroicons/react/24/outline';

type CV = {
  id: number;
  code: string;
  name: string;
  completed: boolean;
  principal: boolean;
  incompleteSteps: string[];
};

export const Dashboard = ({
  isLinked,
  dialogUrl,
  cvs
}: {
  isLinked: boolean;
  dialogUrl: string;
  cvs: CV[];
}) => {
  return (
    <Grid numColsMd={2} numColsLg={3} className="gap-6 mt-6">
      {!isLinked && (
        <Card>
          <Text className="mb-3">
            Connect your InfoJobs account to import your resumes.
          </Text>
          <LoginButton url={dialogUrl} />
        </Card>
      )}
      {cvs.map((cv) => (
        <CVCard key={cv.id} {...cv} />
      ))}
      <Card className="flex items-center justify-center text-blue-500 p-0">
        <Link
          href="/resumes/create"
          className="flex items-center justify-center w-full h-full p-6"
        >
          <PlusIcon className="w-5 h-5 mr-3" />
          Create a new resume
        </Link>
      </Card>
    </Grid>
  );
};

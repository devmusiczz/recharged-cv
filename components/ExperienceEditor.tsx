import { useContext, useEffect, useState } from 'react';
import { CVEditorContext } from '@/cv-editor';
import {
  Grid,
  Card,
  Text,
  Toggle,
  ToggleItem,
  Col,
  Button,
  TextInput
} from '@tremor/react';
import { toast } from 'react-hot-toast';
import { Transition } from '@headlessui/react';
import { Sparkles } from 'lucide-react';

import { DialogSuggestions } from './DialogSuggestions';
import { WYSIWYGEditor } from './WYSIWYGEditor';

const defaultGeneratedText = `1. Organized and prioritized work to complete assignments in a timely, efficient manner. 2. Worked well independently and on a team to solve problems. 3. Served as a friendly, hardworking, and punctual employee. 4. Worked as a productive and positive team member to design, code, test, report, and debug operations.`;

export const ExperienceEditor = ({ isNew, experienceId, onCancel }: any) => {
  const { state, setState } = useContext<any>(CVEditorContext);

  const [experience, setExperience] = useState<any>({
    id: Date.now(),
    job: '',
    startingDate: '',
    finishingDate: '',
    onCourse: false
  });

  const [prompt, setPrompt] = useState<string>(
    'Generate 8 Professional and energetic CV phrases for Employment History section clearly labeling each section 1. 2. 3. 4. Make sure each generated phrase is at least 50 and 100 max characters'
  );

  const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);

  useEffect(() => {
    if (!isNew) {
      setExperience(() =>
        state.experience.experience.find(
          (experience: any) => experience.id === experienceId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPrompt(
      `Generate 8 Professional and energetic CV phrases for Employment History section clearly labeling each section 1. 2. 3. 4. Make sure each generated phrase is at least 50 and 100 max characters based on this context: Job Title: ${experience.job}, Worked well independently and on a team to solve problems. Served as a friendly, hardworking, and punctual employee. Organized and prioritized work to complete assignments in a timely, efficient manner.`
    );
  }, [experience.job]);

  const onChange = (event: any) => {
    const { name, value } = event.target;
    setExperience((prev: any) => ({ ...prev, [name]: value }));
  };

  const onChangeEditor = (description: string) => {
    setExperience((prev: any) => ({ ...prev, description }));
  };

  const validate = () => {
    if (!experience.job) {
      return false;
    }
    if (!experience.startingDate) {
      return false;
    }
    if (!experience.finishingDate && !experience.onCourse) {
      return false;
    }
    return true;
  };

  const onSave = () => {
    if (!validate()) {
      return toast.error('Please fill all the required fields');
    }

    if (!isNew) {
      setState((prev: any) => ({
        ...prev,
        experience: {
          ...prev.experience,
          experience: prev.experience.experience.map((_experience: any) =>
            _experience.id === experienceId ? experience : _experience
          )
        }
      }));
    } else {
      setState((prev: any) => ({
        ...prev,
        experience: {
          ...prev.experience,
          experience: [...prev.experience.experience, experience]
        }
      }));
    }
    onCancel();
  };

  const onDelete = () => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    setState((prev: any) => ({
      ...prev,
      experience: {
        ...prev.experience,
        experience: prev.experience.experience.filter(
          (_experience: any) => _experience.id !== experienceId
        )
      }
    }));
    onCancel();
  };

  return (
    <Card>
      <Grid numCols={2} className="gap-2">
        <Col numColSpan={2}>
          <Text className="mt-4">Job title</Text>
          <TextInput value={experience.job} name="job" onChange={onChange} />
        </Col>
        <Col>
          <Text className="mt-4">Start date</Text>

          <TextInput
            //  @ts-ignore
            type="date"
            name="startingDate"
            value={experience.startingDate?.slice(0, 10)}
            onChange={onChange}
          />
        </Col>
        <Col>
          <Text className="mt-4">End date</Text>
          <TextInput
            //  @ts-ignore
            type="date"
            name="finishingDate"
            value={experience.finishingDate?.slice(0, 10)}
            onChange={onChange}
            disabled={experience.onCourse}
          />
        </Col>
        <Col>
          <Text className="mt-4">Still working here?</Text>
          <Toggle
            color="zinc"
            defaultValue="0"
            onValueChange={(value) => {
              setExperience((prev: any) => ({
                ...prev,
                onCourse: value === '1'
              }));
            }}
          >
            <ToggleItem value="0" text="No" />
            <ToggleItem value="1" text="Yes" />
          </Toggle>
        </Col>
        <Col numColSpan={2}>
          <div className="flex justify-between items-end mt-8">
            <div>
              <Text className="mb-4">
                Description <span className="text-gray-400">(optional)</span>
              </Text>
            </div>
            <div className="relative">
              <Button
                size="xs"
                variant="light"
                className="ring-0 focus:ring-0"
                icon={Sparkles}
                onClick={() => setIsShowingSuggestions(true)}
                disabled={isShowingSuggestions || !experience.job}
              >
                AI Description Suggestions
              </Button>
              <Transition
                show={isShowingSuggestions}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="w-[250%] absolute -right-64 -top-1 z-10">
                  <DialogSuggestions
                    prompt={prompt}
                    defaultContext={experience.job}
                    defaultGeneratedText={defaultGeneratedText}
                    onSelect={(suggestions: string) => {
                      setExperience((prev: any) => ({
                        ...prev,
                        description: `${
                          prev.description ? prev.description + '\n' : ''
                        }${suggestions}`
                      }));
                    }}
                    onClose={() => setIsShowingSuggestions(false)}
                  />
                </div>
              </Transition>
            </div>
          </div>
          <WYSIWYGEditor
            value={experience.description}
            onChange={onChangeEditor}
          />
        </Col>
      </Grid>
      <div className="flex justify-between mt-6">
        {!isNew ? (
          <div>
            <Button
              size="xs"
              color="red"
              variant="secondary"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div></div>
        )}
        <div className="space-x-2">
          <Button size="xs" onClick={onSave}>
            Save
          </Button>
          <Button size="xs" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

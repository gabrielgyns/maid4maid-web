import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserPen } from 'lucide-react';
import { z } from 'zod';

import FormColorInput, {
  DEFAULT_COLOR,
} from '@/components/form/form-color-input';
import FormInput from '@/components/form/form-input';
import FormSwitchInput from '@/components/form/form-switch-input';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Team, teamSchema } from '@/schemas/team.types';

interface TeamModalProps {
  team?: Partial<Team>;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Team>) => Promise<void>;
}

type TeamFormData = z.infer<typeof teamSchema>;

const emptyTeam = {
  name: '',
  description: '',
  isActive: true,
  color: DEFAULT_COLOR,
};

export default function TeamModal({
  team,
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: TeamModalProps) {
  const { t } = useTranslation();

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    mode: 'onBlur',
    defaultValues: emptyTeam,
  });

  useEffect(() => {
    if (team) {
      form.reset({
        id: team.id,
        name: team.name || '',
        description: team.description || '',
        isActive: team.isActive ?? true,
        color: team.color || DEFAULT_COLOR,
      });
    } else {
      form.reset(emptyTeam);
    }
  }, [isOpen, team, form]);

  const handleFormSubmit = useCallback(
    (data: TeamFormData) => {
      void onSubmit(data);
    },
    [onSubmit],
  );

  const resetAndClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && resetAndClose()}
    >
      <DialogContent className="max-w-lg">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit(handleFormSubmit)(e);
            }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <UserPen className="h-5 w-5" />
                {team?.id ? t('Teams.edit_team') : t('Teams.add_team')}
              </DialogTitle>
              <DialogDescription>
                {t('Teams.form.team_information_description')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FormInput form={form} name="name" label={t('Teams.form.name')} />
              <FormTextarea
                form={form}
                name="description"
                label={t('Teams.form.description')}
              />

              <Separator />

              <FormColorInput
                form={form}
                name="color"
                label={t('Teams.form.color')}
                formDescription={t('Teams.form.color_description')}
              />
              <Separator />

              <FormSwitchInput
                form={form}
                name="isActive"
                label={t('Teams.form.is_active_question')}
                formDescription={t('Teams.form.is_active_description')}
              />

              <Separator />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={resetAndClose}
                disabled={isLoading}
              >
                {t('Common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {team?.id ? t('Common.save') : t('Teams.add_team')}
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

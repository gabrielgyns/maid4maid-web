import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import ConfirmDialog from '../confirm-dialog';

type Row<T> = { original: T };

type ActionsCellProps<T> = {
  row?: Row<T>;
  onEdit: (row?: T) => void;
  onDelete: () => Promise<void>;
  deleteTitle?: string;
  deleteDescription?: string;
};

export function ActionsCell<T>({
  row,
  onEdit,
  onDelete,
  deleteTitle = 'Are you sure?',
  deleteDescription = 'This action cannot be undone.',
}: ActionsCellProps<T>) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    console.log('Deleting client', row?.original);

    try {
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('Common.actions')}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => (row ? onEdit(row.original) : onEdit())}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>{t('Common.edit')}</span>
        </DropdownMenuItem>
        <ConfirmDialog
          title={deleteTitle}
          description={deleteDescription}
          confirmText={t('Common.delete')}
          cancelText={t('Common.cancel')}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          destructive
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => event.preventDefault()}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>{t('Common.delete')}</span>
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
